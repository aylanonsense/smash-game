define([
	'config',
	'entity/Entity',
	'util/extend',
	'data/fighterStates',
	'display/draw'
], function(
	config,
	Entity,
	extend,
	fighterStates,
	draw
) {
	function Fighter(params) {
		//data variables
		this.frameData = params.frameData;

		Entity.call(this, extend(params, {
			width: this.frameData.width,
			height: this.frameData.height
		}));

		//state variables
		this.state = 'airborne';
		this.framesInCurrentState = 0;
		this.platform = null;
		this.facing = params.facing || 1;

		//input variables
		this.horizontalDir = 0;
		this.verticalDir = 0;
		this.bufferedActionInput = null;
		this.bufferedDirectionInput = null;
	}
	Fighter.prototype = Object.create(Entity.prototype);
	Fighter.prototype.startOfFrame = function() {
		this.framesInCurrentState++;
		if(this.bufferedActionInput) {
			this.bufferedActionInput.framesBuffered++;
		}
		if(this.bufferedDirectionInput) {
			this.bufferedDirectionInput.framesBuffered++;
		}
	};
	Fighter.prototype.handleInput = function(key, isDown, state) {
		//handle changes of direction
		var inputHandled = true;
		if(key === 'LEFT' && isDown) {
			this.horizontalDir = -1;
		}
		else if(key === 'LEFT' && !isDown) {
			if(this.horizontalDir === -1) { this.horizontalDir = 0; }
		}
		else if(key === 'RIGHT' && isDown) {
			this.horizontalDir = 1;
		}
		else if(key === 'RIGHT' && !isDown) {
			if(this.horizontalDir === 1) { this.horizontalDir = 0; }
		}
		else if(key === 'UP' && isDown) {
			this.verticalDir = -1;
		}
		else if(key === 'UP' && !isDown) {
			if(this.verticalDir === -1) { this.verticalDir = 0; }
		}
		else if(key === 'DOWN' && isDown) {
			this.verticalDir = 1;
		}
		else if(key === 'DOWN' && !isDown) {
			if(this.verticalDir === 1) { this.verticalDir = 0; }
		}

		//buffer inputs
		if(key === 'JUMP' && isDown) {
			this.bufferedActionInput = {
				action: 'JUMP',
				framesBuffered: 0
			};
		}
		else if((key === 'LEFT' || key === 'RIGHT' || key === 'UP' || key === 'DOWN') && isDown) {
			this.bufferedDirectionInput = {
				dir: key,
				framesBuffered: 0
			};
		}

		//check for state transitions
		this.checkForStateTransitions();
	};
	Fighter.prototype.move = function(platforms) {
		//apply physics
		var m, stillVelX = (this.platform ? this.platform.vel.x : 0), stillVelY = 0;
		if(fighterStates[this.state].physics === 'standing') {
			//standing physics just involves slowly decelerating until still
			var standingDeceleration = this.getFrameDataValue('standingDeceleration');
			var standingSoftMaxSpeed = this.getFrameDataValue('standingSoftMaxSpeed');
			var standingAboveMaxSpeedDeceleration = this.getFrameDataValue('standingAboveMaxSpeedDeceleration');
			m = this.vel.x > stillVelX ? 1 : -1; //1 if moving right, -1 if moving left
			//decelerate move speed
			if(this.vel.x * m > stillVelX * m + standingSoftMaxSpeed) {
				this.vel.x -= standingAboveMaxSpeedDeceleration * m / 60;
			}
			else {
				this.vel.x -= standingDeceleration * m / 60;
			}
			//don't decelerate past the still velocity
			if(this.vel.x * m < stillVelX * m) {
				this.vel.x = stillVelX;
			}
		}
		else if(fighterStates[this.state].physics === 'running') {
			//when running we assume the player is moving continually in the direction they are facing
			var runningAcceleration = this.getFrameDataValue('runningAcceleration');
			var runningSoftMaxSpeed = this.getFrameDataValue('runningSoftMaxSpeed');
			var runningAboveMaxSpeedDeceleration = this.getFrameDataValue('runningAboveMaxSpeedDeceleration');
			var runningWrongWayDeceleration = this.getFrameDataValue('runningWrongWayDeceleration');
			m = this.facing; //1 if facing right, -1 if facing left
			//running above max speed, decelerate
			if(this.vel.x * m > stillVelX * m + runningSoftMaxSpeed) {
				this.vel.x -= runningAboveMaxSpeedDeceleration * m / 60;
				//don't decelerate past the max speed
				if(this.vel.x * m < stillVelX * m + runningSoftMaxSpeed) {
					this.vel.x = stillVelX + runningSoftMaxSpeed * m;
				}
			}
			else {
				//moving in the right direction, accelerate up to the max speed
				if(this.vel.x * m > stillVelX * m) {
					this.vel.x += runningAcceleration * m / 60;
				}
				//moving the wrong way, decelerate
				else {
					this.vel.x += runningWrongWayDeceleration * m / 60;
				}
				//don't accelerate past the max speed
				if(this.vel.x * m > stillVelX * m + runningSoftMaxSpeed) {
					this.vel.x = stillVelX + runningSoftMaxSpeed * m;
				}
			}
		}
		else if(fighterStates[this.state].physics === 'airborne') {
			//when airborne, the player can freely move back and forth	
			var airborneAcceleration = this.getFrameDataValue('airborneAcceleration');
			var airborneDeceleration = this.getFrameDataValue('airborneDeceleration');
			var airborneSoftMaxSpeed = this.getFrameDataValue('airborneSoftMaxSpeed');
			var airborneAboveMaxSpeedDeceleration = this.getFrameDataValue('airborneAboveMaxSpeedDeceleration');
			var airborneTurnaroundDeceleration = this.getFrameDataValue('airborneTurnaroundDeceleration');
			m = this.vel.x > stillVelX ? 1 : -1; //1 if moving right, -1 if moving left
			if(this.vel.x === stillVelX) { m = this.horizontalDir; }
			//not trying to move
			if(this.horizontalDir === 0) {
				//decelerate from above max speed
				if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
					this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
				}
				//decelerate normally
				else {
					this.vel.x -= airborneDeceleration * m / 60;
				}
				//don't decelerate past zero
				if(this.vel.x * m < stillVelX * m) {
					this.vel.x = stillVelX;
				}
			}
			//trying to move in the direction of movement
			else if(this.horizontalDir === m) {
				//decelerate down to max speed
				if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
					this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
					if(this.vel.x * m < stillVelX * m + airborneSoftMaxSpeed) {
						this.vel.x = stillVelX + airborneSoftMaxSpeed * m;
					}
				}
				//accelerate up to max speed
				else {
					this.vel.x += airborneAcceleration * m / 60;
					if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
						this.vel.x = stillVelX + airborneSoftMaxSpeed * m;
					}
				}
			}
			//m === 1 (moving right), horizontalDir === -1 (trying to move left)
			//trying to move opposite the direction of movement
			else {
				//decelerate if moving above max speed the ~other~ way
				if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
					this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
				}
				//decelerate normally
				else {
					this.vel.x -= airborneTurnaroundDeceleration * m / 60;
				}
				//don't let this make us accelerate above max speed
				if(this.vel.x * m < stillVelX * m - airborneSoftMaxSpeed) {
					this.vel.x = stillVelX - airborneSoftMaxSpeed * m;
				}
			}
		}

		//always apply gravity, even while grounded
		var gravity = this.getFrameDataValue('gravity');
		var softMaxFallSpeed = this.getFrameDataValue('softMaxFallSpeed');
		var aboveMaxFallSpeedDeceleration = this.getFrameDataValue('aboveMaxFallSpeedDeceleration');
		this.vel.y += gravity / 60;
		//if falling too fast, slow down
		if(this.vel.y > stillVelY + softMaxFallSpeed) {
			this.vel.y -= aboveMaxFallSpeedDeceleration / 60;
			if(this.vel.y < stillVelY + softMaxFallSpeed) {
				this.vel.y = stillVelY + softMaxFallSpeed;
			}
		}

		//ensure the velocity doens't get too crazy, keep it bounded
		var absoluteMaxHorizontalSpeed = this.getFrameDataValue('absoluteMaxHorizontalSpeed');
		var absoluteMaxVerticalSpeed = this.getFrameDataValue('absoluteMaxVerticalSpeed');
		if(this.vel.x > absoluteMaxHorizontalSpeed) { this.vel.x = absoluteMaxHorizontalSpeed; }
		else if(this.vel.x < -absoluteMaxHorizontalSpeed) { this.vel.x = -absoluteMaxHorizontalSpeed; }
		if(this.vel.y > absoluteMaxVerticalSpeed) { this.vel.y = absoluteMaxVerticalSpeed; }
		else if(this.vel.y < -absoluteMaxVerticalSpeed) { this.vel.y = -absoluteMaxVerticalSpeed; }

		//update position
		var collisions = [];
		var moveSteps = Math.max(1, Math.ceil(Math.max(Math.abs(this.vel.x / 60), Math.abs(this.vel.y / 60)) / config.MAX_MOVEMENT_PER_STEP));
		for(var i = 0; i < moveSteps; i++) {
			//move in steps to avoid clipping through a platform
			this.pos.x += (this.vel.x / 60) / moveSteps;
			this.pos.y += (this.vel.y / 60) / moveSteps;
			//check for collisions
			for(var j = 0; j < platforms.length; j++) {
				if(this.collisionBoxes.left.isOverlapping(platforms[j])) {
					if(this.vel.x < 0) { this.vel.x = 0; }
					this.left = platforms[j].right;
					collisions.push({ platform: platforms[j], dir: 'left' });
				}
				if(this.collisionBoxes.right.isOverlapping(platforms[j])) {
					if(this.vel.x > 0) { this.vel.x = 0; }
					this.right = platforms[j].left;
					collisions.push({ platform: platforms[j], dir: 'right' });
				}
				if(this.collisionBoxes.bottom.isOverlapping(platforms[j])) {
					if(this.vel.y > 0) { this.vel.y = 0; }
					this.bottom = platforms[j].top;
					collisions.push({ platform: platforms[j], dir: 'bottom' });
				}
				if(this.collisionBoxes.top.isOverlapping(platforms[j])) {
					if(this.vel.y < 0) { this.vel.y = 0; }
					this.top = platforms[j].bottom;
					collisions.push({ platform: platforms[j], dir: 'top' });
				}
			}
		}

		//handle all collisions that happened during movement
		this.platform = null;
		for(i = 0; i < collisions.length; i++) {
			this.handleCollision(collisions[i].platform, collisions[i].dir);
		}

		//check for state transitions
		this.checkForStateTransitions();
	};
	Fighter.prototype.handleCollision = function(platform, dir) {
		if(dir === 'bottom') {
			this.platform = platform;
		}
	};
	Fighter.prototype.endOfFrame = function() {};
	Fighter.prototype.render = function() {
		//draw sprite
		var sprite = this.getFrameDataValue('sprite');
		var frame = this.getFrameDataValue('spriteFrame');
		draw.sprite(sprite, frame, this.pos.x, this.pos.y, { flip: this.facing < 0 });

		//draw debug data
		if(config.SHOW_FIGHTER_DEBUG_DATA) {
			//draw info below the sprite
			draw.text(this.state, this.pos.x, this.pos.y + 15, { fontSize: 14, color: '#fff', align: 'center' });
			draw.text('(frame ' + (this.framesInCurrentState + 1) + ')', this.pos.x, this.pos.y + 27, { fontSize: 10, color: '#aaa', align: 'center' });
			draw.text('speed = ' + Math.floor(Math.abs(this.vel.x)), this.pos.x, this.pos.y + 42, { fontSize: 14, color: '#ccc', align: 'center' });

			//draw collision boxes
			draw.poly(this.collisionBoxes.left.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.top.top,
				this.collisionBoxes.top.right, this.collisionBoxes.top.top,  this.collisionBoxes.top.right, this.collisionBoxes.right.top,  this.collisionBoxes.right.right, this.collisionBoxes.right.top,
				this.collisionBoxes.right.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.bottom.bottom,
				this.collisionBoxes.bottom.left, this.collisionBoxes.bottom.bottom,  this.collisionBoxes.bottom.left, this.collisionBoxes.left.bottom,  this.collisionBoxes.left.left, this.collisionBoxes.left.bottom,
				{ close: true, stroke: '#fff', thickness: 1 });
		}
	};

	//helper methods
	Fighter.prototype.checkForStateTransitions = function() {
		var stateHasChanged = this.checkForStateTransition();
		for(var numTransitions = 0; numTransitions < 10 && stateHasChanged; numTransitions++) {
			stateHasChanged = this.checkForStateTransition();
		}
	};
	Fighter.prototype.checkForStateTransition = function() {
		//figure out if the animation has looped
		var totalAnimationFrames = 0;
		for(var i = 0; i < this.frameData.states[this.state].animation.length; i++) {
			totalAnimationFrames += this.frameData.states[this.state].animation[i].frames;
		}
		var animationHasLooped = this.framesInCurrentState >= totalAnimationFrames;

		//then iterate through all possible transitions and see if one is valid
		for(i = 0; i < fighterStates[this.state].transitions.length; i++) {
			var transition = fighterStates[this.state].transitions[i];
			//check to see if the transition's conditions are satisfied
			if((transition.cancel || animationHasLooped) && (!fighterStates[transition.state].conditions || fighterStates[transition.state].conditions.call(this))) {
				//we can transition to the new state!
				this.setState(transition.state);
				return true;
			}
		}
		return false;
	};
	Fighter.prototype.setState = function(state, frame) {
		//apply effects from leaving the old state
		if(fighterStates[this.state].effectsOnLeave) {
			fighterStates[this.state].effectsOnLeave.call(this, state);
		}
		//switch to the new state
		var prevState = this.state;
		this.state = state;
		this.framesInCurrentState = frame || 0;
		//apply effects from entering the new state
		if(fighterStates[this.state].effectsOnEnter) {
			fighterStates[this.state].effectsOnEnter.call(this, prevState);
		}
	};
	Fighter.prototype.getFrameDataValue = function(key) {
		var animation = this.getCurrentAnimationFrame();
		if(typeof animation[key] !== 'undefined') {
			return animation[key];
		}
		else if(typeof this.frameData.states[this.state][key] !== 'undefined') {
			return this.frameData.states[this.state][key];
		}
		else {
			return this.frameData[key];
		}
	};
	Fighter.prototype.getCurrentAnimationFrame = function() {
		//first, figure out the total animation time
		var totalFrames = 0;
		for(var i = 0; i < this.frameData.states[this.state].animation.length; i++) {
			totalFrames += this.frameData.states[this.state].animation[i].frames;
		}

		//then, figure out how far we are in that animation
		var frames = this.framesInCurrentState % totalFrames;
		for(i = 0; i < this.frameData.states[this.state].animation.length; i++) {
			frames -= this.frameData.states[this.state].animation[i].frames;
			if(frames < 0) {
				return this.frameData.states[this.state].animation[i];
			}
		}
		return null;
	};
	/*Fighter.prototype.handleInput = function(inputs, inputState) {
		var numUpdates, maxStateUpdates = 10;
		for(var i = 0; i < inputs.length; i++) {
			this.inputState = inputs[i].state;
			for(numUpdates = 0; numUpdates < maxStateUpdates; numUpdates++) {
				if(!this._updateState(inputs[i])) {
					break;
				}
			}
		}
		this.inputState = inputState;
		for(numUpdates = 0; numUpdates < maxStateUpdates; numUpdates++) {
			if(!this._updateState(null)) {
				break;
			}
		}
	};
	Fighter.prototype._updateState = function(input) {
		var stateHasLooped = this.framesInCurrentState >= moveData[this.state].totalFrames;
		var horizontalDir = this.inputState.horizontalDir;
		var verticalDir = this.inputState.verticalDir;

		//STANDING <--> RUNNING
		//standing --> run_start
		if(this.state === 'standing' && horizontalDir === this.facing) {
			this.setState('run_start');
		}
		//run_start --> running
		else if(this.state === 'run_start' && stateHasLooped) {
			this.setState('running');
		}
		//running --> run_end
		else if(this.state === 'running' && horizontalDir === 0) {
			this.setState('run_end');
		}
		//run_end --> standing
		else if(this.state === 'run_end' && stateHasLooped) {
			this.setState('standing');
		}
		//run_start -(cancel)-> run_end
		else if(this.state === 'run_start' && horizontalDir === 0 && this._stateIsCancelableBy('run_end')) {
			this.setState('run_end', moveData.run_end.earlyCancelFrame);
		}

		//STANDING TURNAROUND
		//standing --> standing_turnaround_start
		else if(this.state === 'standing' && horizontalDir === -this.facing) {
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//standing_turnaround_start --> standing_turnaround_end
		else if(this.state === 'standing_turnaround_start' && horizontalDir !== this.facing && stateHasLooped) {
			this.setState('standing_turnaround_end');
		}
		//standing_turnaround_end --> standing
		else if(this.state === 'standing_turnaround_end' && stateHasLooped) {
			this.setState('standing');
		}
		//standing_turnaround_start --> running_turnaround_end
		else if(this.state === 'standing_turnaround_start' && horizontalDir === this.facing && stateHasLooped) {
			this.setState('running_turnaround_end');
		}
		//standing_turnaround_start -(cancel)-> standing_turnaround_start
		else if(this.state === 'standing_turnaround_start' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			//TODO buffer input for double-turnarounds?
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//standing_turnaround_end -(cancel)-> standing_turnaround_start
		else if(this.state === 'standing_turnaround_end' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			//TODO buffer input for double-turnarounds?
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}

		//RUNNING TURNAROUND
		//running --> running_turnaround_start
		else if(this.state === 'running' && horizontalDir === -this.facing) {
			this.facing = horizontalDir;
			this.setState('running_turnaround_start');
		}
		//running_turnaround_start --> running_turnaround_end
		else if(this.state === 'running_turnaround_start' && horizontalDir === this.facing && stateHasLooped) {
			this.setState('running_turnaround_end');
		}
		//running_turnaround_end --> running
		else if(this.state === 'running_turnaround_end' && stateHasLooped) {
			this.setState('running');
		}
		//running_turnaround_start --> standing_turnaround_end
		else if(this.state === 'running_turnaround_start' && horizontalDir !== this.facing && stateHasLooped) {
			this.setState('standing_turnaround_end');
		}
		//run_end -(cancel)-> running_turnaround_start
		else if(this.state === 'run_end' && horizontalDir === -this.facing && this._stateIsCancelableBy('running_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('running_turnaround_start');
		}
		//run_end -(cancel)-> standing_turnaround_start
		else if(this.state === 'run_end' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//running_turnaround_start -(cancel)-> standing_turnaround_start
		else if(this.state === 'running_turnaround_start' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//running_turnaround_end -(cancels)-> running_turnaround_start
		else if(this.state === 'running_turnaround_end' && horizontalDir === -this.facing && this._stateIsCancelableBy('running_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('running_turnaround_start');
		}

		//STANDING <--> CROUCHING
		//standing --> crouch_start
		else if(this.state === 'standing' && verticalDir === -1) {
			this.setState('crouch_start');
		}
		//crouch_start --> crouching
		else if(this.state === 'crouch_start' && stateHasLooped) {
			this.setState('crouching');
		}
		//crouching --> crouch_end
		else if(this.state === 'crouching' && verticalDir !== -1) {
			this.setState('crouch_end');
		}
		//crouch_end --> standing
		else if(this.state === 'crouch_end' && stateHasLooped) {
			this.setState('standing');
		}
		//crouch_start -(cancels)-> crouch_end
		else if(this.state === 'crouch_start' && verticalDir !== -1 && this._stateIsCancelableBy('crouch_end')) {
			this.setState('crouch_end');
		}
		//crouch_end -(cancels)-> run_start
		else if(this.state === 'crouch_end' && horizontalDir === this.facing && this._stateIsCancelableBy('run_start')) {
			this.setState('run_start');
		}
		//crouch_end -(cancels)-> standing_turnaround_start
		else if(this.state === 'crouch_end' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//running -(cancels)-> crouch_start
		else if(this.state === 'running' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this.setState('crouch_start');
		}
		//run_end -(cancels)-> crouch_start
		else if(this.state === 'run_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this.setState('crouch_start');
		}
		//running_turnaround_end -(cancels)-> crouch_start
		else if(this.state === 'running_turnaround_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this.setState('crouch_start');
		}
		//standing_turnaround_end -(cancels)-> crouch_start
		else if(this.state === 'standing_turnaround_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this.setState('crouch_start');
		}

		//LANDING
		//jump_landing --> standing
		else if(this.state === 'jump_landing' && stateHasLooped) {
			this.setState('standing');
		}

		//JUMPING
		//(many grounded states) --> jump_takeoff
		else if((this.state === 'standing' || this.state === 'running' ||
			this.state === 'standing_turnaround_start' || this.state === 'standing_turnaround_end' ||
			this.state === 'running_turnaround_start' || this.state === 'running_turnaround_end' ||
			this.state === 'crouch_start' || this.state === 'crouching' ||
			this.state === 'crouch_end' || this.state === 'run_start' ||
			this.state === 'run_end') && input && input.key === 'JUMP' && input.isDown) {
			this.setState('jump_takeoff');
		}
		//jump_takeoff --> airborne
		else if(this.state === 'jump_takeoff' && stateHasLooped) {
			this.platform = null;
			this.vel.y = -moveData.jump_takeoff.jumpSpeed;
			this.setState('airborne');
		}
		//jump_landing -(cancels)-> jump_takeoff
		if(this.state === 'jump_landing' && this._stateIsCancelableBy('jump_takeoff') &&
			input && input.key === 'JUMP' && input.isDown) {
			this.setState('jump_takeoff');
		}
		//jump_landing -(cancels)-> run_start
		if(this.state === 'jump_landing' && horizontalDir === this.facing && this._stateIsCancelableBy('run_start')) {
			this.setState('run_start');
		}
		//jump_landing -(cancels)-> standing_turnaround_start
		if(this.state === 'jump_landing' && horizontalDir === -this.facing && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facing = horizontalDir;
			this.setState('standing_turnaround_start');
		}
		//jump_landing -(cancels)-> crouching
		if(this.state === 'jump_landing' && verticalDir === -1 && this._stateIsCancelableBy('crouching')) {
			this.setState('crouching');
		}

		else { return false; }
		return true;
	};
	Fighter.prototype.move = function(t, platforms) {
		var gravity = typeof moveData[this.state].gravity === 'number' ? moveData[this.state].gravity : moveData.airborne.gravity;
		var maxSpeed, acceleration, deceleration, aboveMaxSpeedDeceleration;
		//slide to a stop while standing
		if(moveData[this.state].physics === 'standing')  {
			deceleration = typeof moveData[this.state].deceleration === 'number' ? moveData[this.state].deceleration : moveData.standing.deceleration;
			if(this.vel.x > 0) {
				this.vel.x = Math.max(0, this.vel.x - deceleration / 60);
			}
			else if(this.vel.x < 0) {
				this.vel.x = Math.min(0, this.vel.x + deceleration * t);
			}
		}
		//increase speed while running
		else if(moveData[this.state].physics === 'running') {
			maxSpeed = typeof moveData[this.state].maxSpeed === 'number' ? moveData[this.state].maxSpeed : moveData.running.maxSpeed;
			acceleration = typeof moveData[this.state].acceleration === 'number' ? moveData[this.state].acceleration : moveData.running.acceleration;
			aboveMaxSpeedDeceleration = typeof moveData[this.state].aboveMaxSpeedDeceleration === 'number' ? moveData[this.state].aboveMaxSpeedDeceleration : moveData.running.aboveMaxSpeedDeceleration;
			//if we're running over top speed, slow down (slowly)
			if(this.vel.x * this.facing > maxSpeed) {
				this.vel.x -= this.facing * aboveMaxSpeedDeceleration * t;
				if(this.vel.x * this.facing < maxSpeed) {
					this.vel.x = this.facing * maxSpeed;
				}
			}
			//otherwise, speed up
			else {
				this.vel.x += this.facing * acceleration * t;
				if(this.vel.x * this.facing > maxSpeed) {
					this.vel.x = this.facing * maxSpeed;
				}
			}
		}
		else if(moveData[this.state].physics === 'airborne') {
			maxSpeed = typeof moveData[this.state].maxSpeed === 'number' ? moveData[this.state].maxSpeed : moveData.airborne.maxSpeed;
			acceleration = typeof moveData[this.state].acceleration === 'number' ? moveData[this.state].acceleration : moveData.airborne.acceleration;
			deceleration = typeof moveData[this.state].deceleration === 'number' ? moveData[this.state].deceleration : moveData.airborne.deceleration;
			aboveMaxSpeedDeceleration = typeof moveData[this.state].aboveMaxSpeedDeceleration === 'number' ? moveData[this.state].aboveMaxSpeedDeceleration : moveData.airborne.aboveMaxSpeedDeceleration;
			//if you're trying to move right
			if(this.inputState.horizontalDir > 0) {
				//if you're moving above max speed
				if(this.vel.x > maxSpeed) {
					this.vel.x -= aboveMaxSpeedDeceleration * t;
					if(this.vel.x < maxSpeed) {
						this.vel.x = maxSpeed;
					}
				}
				else {
					//if you're moving above max speed the other way
					if(this.vel.x < -maxSpeed) {
						this.vel.x += Math.max(acceleration, aboveMaxSpeedDeceleration) * t;
					}
					//if you're moving within reasonable speeds
					else {
						this.vel.x += acceleration * t;
					}
					if(this.vel.x > maxSpeed) {
						this.vel.x = maxSpeed;
					}
				}
			}
			//if you're trying to move left
			else if(this.inputState.horizontalDir < 0) {
				//if you're moving above max speed
				if(this.vel.x < -maxSpeed) {
					this.vel.x += aboveMaxSpeedDeceleration * t;
					if(this.vel.x > -maxSpeed) {
						this.vel.x = -maxSpeed;
					}
				}
				else {
					//if you're moving above max speed the other way
					if(this.vel.x > maxSpeed) {
						this.vel.x -= Math.max(acceleration, aboveMaxSpeedDeceleration) * t;
					}
					//if you're moving within reasonable speeds
					else {
						this.vel.x -= acceleration * t;
					}
					if(this.vel.x < -maxSpeed) {
						this.vel.x = -maxSpeed;
					}
				}
			}
			//if you're not moving
			else {
				if(this.vel.x > 0) {
					if(this.vel.x > maxSpeed) {
						this.vel.x -= aboveMaxSpeedDeceleration * t;
					}
					else {
						this.vel.x -= deceleration * t;
					}
					if(this.vel.x < 0) {
						this.vel.x = 0;
					}
				}
				else if(this.vel.x < 0) {
					if(this.vel.x < -maxSpeed) {
						this.vel.x += aboveMaxSpeedDeceleration * t;
					}
					else {
						this.vel.x += deceleration * t;
					}
					if(this.vel.x > 0) {
						this.vel.x = 0;
					}
				}
			}
		}

		//update position
		this.vel.y += gravity * t;
		var dx = this.vel.x * t, dy = this.vel.y * t;
		var moveSteps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 5));
		var collisions = [];
		for(var i = 0; i < steps; i++) {
			//move in steps
			this.pos.x += dx / steps;
			this.pos.y += dy / steps;
			//check for collisions
			for(var j = 0; j < platforms.length; j++) {
				if(this.collisionBoxes.left.isOverlapping(platforms[j])) {
					if(this.vel.x < 0) { this.vel.x = 0; }
					this.left = platforms[j].right;
					collisions.push({ platform: platforms[j], dir: 'left' });
				}
				if(this.collisionBoxes.right.isOverlapping(platforms[j])) {
					if(this.vel.x > 0) { this.vel.x = 0; }
					this.right = platforms[j].left;
					collisions.push({ platform: platforms[j], dir: 'right' });
				}
				if(this.collisionBoxes.bottom.isOverlapping(platforms[j])) {
					if(this.vel.y > 0) { this.vel.y = 0; }
					this.bottom = platforms[j].top;
					collisions.push({ platform: platforms[j], dir: 'bottom' });
				}
				if(this.collisionBoxes.top.isOverlapping(platforms[j])) {
					if(this.vel.y < 0) { this.vel.y = 0; }
					this.top = platforms[j].bottom;
					collisions.push({ platform: platforms[j], dir: 'top' });
				}
			}
		}
		//trigger all collisions
		var wasAirborne = !this.platform;
		this.platform = null;
		for(i = 0; i < collisions.length; i++) {
			this.handleCollision(collisions[i].platform, collisions[i].dir);
		}
		var isAirborne = !this.platform;
		//update state due to movement
		if(wasAirborne && !isAirborne) {
			this.setState('jump_landing');
		}
		else if(!wasAirborne && isAirborne) {
			this.setState('airborne');
		}

	};
	Fighter.prototype.handleCollision = function(platform, dir) {
		if(dir === 'bottom') {
			this.platform = platform;
		}
	};
	Fighter.prototype.setState = function(state, frame) {
		this.state = state;
		this.framesInCurrentState = frame || 0;
	};
	Fighter.prototype._stateIsCancelableBy = function(action) {
		if(moveData[this.state].cancels && moveData[this.state].cancels.indexOf(action) >= 0) {
			return true;
		}
		else {
			var frames = this.framesInCurrentState % moveData[this.state].totalFrames;
			for(var i = 0; i < moveData[this.state].animation.length; i++) {
				frames -= moveData[this.state].animation[i].frames;
				if(frames < 0) {
					return moveData[this.state].animation[i].cancels &&
					moveData[this.state].animation[i].cancels.indexOf(action) >= 0;
				}
			}
			return false;
		}
	};
	Fighter.prototype.render = function() {
		//figure out frame
		var displayedFrame = 0;
		var currFrame = this.framesInCurrentState % moveData[this.state].totalFrames;
		totalFrames = 0;
		for(i = 0; i < moveData[this.state].animation.length; i++) {
			totalFrames += moveData[this.state].animation[i].frames;
			if(totalFrames > currFrame) {
				displayedFrame = moveData[this.state].animation[i].sprite;
				break;
			}
		}

		//draw sprite
		draw.sprite('fighter', displayedFrame, this.pos.x, this.pos.y, { flip: this.facing < 0 });

		if(config.SHOW_FIGHTER_DEBUG_DATA) {
			//draw debug data below sprite
			draw.text(this.state, this.pos.x, this.pos.y + 15, { fontSize: 14, color: '#fff', align: 'center' });
			draw.text('(frame ' + (this.framesInCurrentState + 1) + ')', this.pos.x, this.pos.y + 27, { fontSize: 10, color: '#aaa', align: 'center' });
			draw.text('speed = ' + Math.floor(Math.abs(this.vel.x)), this.pos.x, this.pos.y + 42, { fontSize: 14, color: '#ccc', align: 'center' });

			//draw collision boxes
			draw.poly(this.collisionBoxes.left.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.top.top,
				this.collisionBoxes.top.right, this.collisionBoxes.top.top,  this.collisionBoxes.top.right, this.collisionBoxes.right.top,  this.collisionBoxes.right.right, this.collisionBoxes.right.top,
				this.collisionBoxes.right.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.bottom.bottom,
				this.collisionBoxes.bottom.left, this.collisionBoxes.bottom.bottom,  this.collisionBoxes.bottom.left, this.collisionBoxes.left.bottom,  this.collisionBoxes.left.left, this.collisionBoxes.left.bottom,
				{ close: true, stroke: '#fff', thickness: 1 });
		}
	};*/
	return Fighter;
});