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
		this.state = 'standing';
		this.framesInCurrentState = 0;
		this.platform = null;
		this.facing = params.facing || 1;
		this.airborneJumpsUsed = 0;
		this.isBlocking = false;
		this.framesSpentBlocking = 0;
		this.framesSinceLastJump = 0;
		this.framesSinceLastDash = 0;

		//input variables
		this.horizontalDir = 0;
		this.verticalDir = 0;
		this.isHoldingBlock = false;
		this.bufferedActionInput = null;
		this.bufferedHorizontalDirectionInput = null;
		this.bufferedVerticalDirecitonInput = null;
	}
	Fighter.prototype = Object.create(Entity.prototype);
	Fighter.prototype.startOfFrame = function() {
		this.framesInCurrentState++;
		this.framesSinceLastJump++;
		this.framesSinceLastDash++;
		if(this.bufferedActionInput) {
			this.bufferedActionInput.framesBuffered++;
			if(this.bufferedActionInput.framesBuffered > 5) {
				this.bufferedActionInput = null;
			}
		}
		if(this.bufferedHorizontalDirectionInput) {
			this.bufferedHorizontalDirectionInput.framesBuffered++;
			if(this.bufferedHorizontalDirectionInput.framesBuffered > 5) {
				this.bufferedHorizontalDirectionInput = null;
			}
		}
		if(this.bufferedVerticalDirecitonInput) {
			this.bufferedVerticalDirecitonInput.framesBuffered++;
			if(this.bufferedVerticalDirecitonInput.framesBuffered > 5) {
				this.bufferedVerticalDirecitonInput = null;
			}
		}
		if(this.isBlocking) {
			this.framesSpentBlocking++;
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

		//handle changes in blocking
		if(key === 'BLOCK') {
			this.isHoldingBlock = isDown;
			if(isDown && this.horizontalDir !== 0) {
				this.bufferedActionInput = {
					action: 'DASH',
					dir: this.horizontalDir,
					framesBuffered: 0
				};
			}
		}

		//buffer inputs
		if(key === 'JUMP' && isDown) {
			this.bufferedActionInput = {
				action: 'JUMP',
				framesBuffered: 0
			};
		}
		else if((key === 'LEFT' || key === 'RIGHT') && isDown) {
			this.bufferedHorizontalDirectionInput = {
				dir: (key === 'LEFT' ? -1 : 1),
				framesBuffered: 0
			};
			if(this.isHoldingBlock) {
				this.bufferedActionInput = {
					action: 'DASH',
					dir: this.horizontalDir,
					framesBuffered: 0
				};
			}
		}
		else if((key === 'UP' || key === 'DOWN') && isDown) {
			this.bufferedVerticalDirectionInput = {
				dir: (key === 'UP' ? -1 : 1),
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
			var runningSoftMaxSpeed = this.getFrameDataValue('runningSoftMaxSpeed');
			var runningAcceleration = this.getFrameDataValue('runningAcceleration');
			var runningWrongWayDeceleration = this.getFrameDataValue('runningWrongWayDeceleration');
			var runningAboveMaxSpeedDeceleration = this.getFrameDataValue('runningAboveMaxSpeedDeceleration');
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
			var airborneSoftMaxSpeed = this.getFrameDataValue('airborneSoftMaxSpeed');
			var airborneAcceleration = this.getFrameDataValue('airborneAcceleration');
			var airborneDeceleration = this.getFrameDataValue('airborneDeceleration');
			var airborneTurnaroundDeceleration = this.getFrameDataValue('airborneTurnaroundDeceleration');
			var airborneAboveMaxSpeedDeceleration = this.getFrameDataValue('airborneAboveMaxSpeedDeceleration');
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
		if(this.vel.y < stillVelX + softMaxFallSpeed) {
			this.vel.y += gravity / 60;
			if(this.vel.y > stillVelY + softMaxFallSpeed) {
				this.vel.y = stillVelY + softMaxFallSpeed;
			}
		}
		//if falling too fast, slow down
		else {
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
			this.airborneJumpsUsed = 0;
		}
	};
	Fighter.prototype.endOfFrame = function() {
		if(this.isBlocking && !fighterStates[this.state].isBlocking) {
			this.isBlocking = false;
		}
		else if(!this.isBlocking && fighterStates[this.state].isBlocking) {
			this.isBlocking = true;
			this.framesSpentBlocking = 0;
		}
	};
	Fighter.prototype.render = function() {
		//draw sprite
		var sprite = this.getFrameDataValue('sprite');
		var frame = this.getFrameDataValue('spriteFrame');
		draw.sprite(sprite, frame, this.pos.x, this.pos.y, { flip: this.facing < 0 });
		if(this.isBlocking) {
			draw.sprite('shield', 2, this.pos.x, this.pos.y);
		}

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
		if(!this.frameData.states[this.state]) {
			console.log(this.state + " is not defined in the frame data!");
		}

		//figure out if the animation has looped
		var totalAnimationFrames = 0;
		for(var i = 0; i < this.frameData.states[this.state].animation.length; i++) {
			totalAnimationFrames += this.frameData.states[this.state].animation[i].frames;
		}
		var animationHasLooped = this.framesInCurrentState >= totalAnimationFrames;

		//then iterate through all possible transitions and see if one is valid
		var frameCancels = this.getFrameDataValue('frameCancels');
		for(i = 0; i < fighterStates[this.state].transitions.length; i++) {
			var transition = fighterStates[this.state].transitions[i];
			//check to make sure the transition can be canceled into
			if(transition.cancel || (!transition.frameCancel && animationHasLooped) ||
				(transition.frameCancel && frameCancels && frameCancels.indexOf(transition.state) >= 0)) {
				//check to see if the transition's conditions are satisfied
				if(!fighterStates[transition.state].conditions || fighterStates[transition.state].conditions.call(this)) {
					//we can transition to the new state!
					this.setState(transition.state);
					return true;
				}
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
		var prevFrames = this.framesInCurrentState;
		this.state = state;
		this.framesInCurrentState = frame || 0;
		//apply effects from entering the new state
		if(fighterStates[this.state].effectsOnEnter) {
			fighterStates[this.state].effectsOnEnter.call(this, prevState, prevFrames);
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
	return Fighter;
});