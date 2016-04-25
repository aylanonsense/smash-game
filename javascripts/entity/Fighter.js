define([
	'config',
	'entity/Entity',
	'util/extend',
	'entity/moveData',
	'display/draw'
], function(
	config,
	Entity,
	extend,
	moveData,
	draw
) {
	function Fighter(params) {
		Entity.call(this, extend(params, {
			height: 60,
			width: 54
		}));
		this.inputState = params.inputState;
		this.facingDir = params.facing || 0;
		this.state = 'airborne';
		this.framesInCurrentState = 0;
		this.supportingPlatform = null;
	}
	Fighter.prototype = Object.create(Entity.prototype);
	Fighter.prototype.startOfFrame = function(t) {
		this.framesInCurrentState++;
	};
	Fighter.prototype.handleInput = function(inputs, inputState) {
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
		if(this.state === 'standing' && horizontalDir === this.facingDir) {
			this._setState('run_start');
		}
		//run_start --> running
		else if(this.state === 'run_start' && stateHasLooped) {
			this._setState('running');
		}
		//running --> run_end
		else if(this.state === 'running' && horizontalDir === 0) {
			this._setState('run_end');
		}
		//run_end --> standing
		else if(this.state === 'run_end' && stateHasLooped) {
			this._setState('standing');
		}
		//run_start -(cancel)-> run_end
		else if(this.state === 'run_start' && horizontalDir === 0 && this._stateIsCancelableBy('run_end')) {
			this._setState('run_end', moveData.run_end.earlyCancelFrame);
		}

		//STANDING TURNAROUND
		//standing --> standing_turnaround_start
		else if(this.state === 'standing' && horizontalDir === -this.facingDir) {
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//standing_turnaround_start --> standing_turnaround_end
		else if(this.state === 'standing_turnaround_start' && horizontalDir !== this.facingDir && stateHasLooped) {
			this._setState('standing_turnaround_end');
		}
		//standing_turnaround_end --> standing
		else if(this.state === 'standing_turnaround_end' && stateHasLooped) {
			this._setState('standing');
		}
		//standing_turnaround_start --> running_turnaround_end
		else if(this.state === 'standing_turnaround_start' && horizontalDir === this.facingDir && stateHasLooped) {
			this._setState('running_turnaround_end');
		}
		//standing_turnaround_start -(cancel)-> standing_turnaround_start
		else if(this.state === 'standing_turnaround_start' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			//TODO buffer input for double-turnarounds?
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//standing_turnaround_end -(cancel)-> standing_turnaround_start
		else if(this.state === 'standing_turnaround_end' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			//TODO buffer input for double-turnarounds?
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}

		//RUNNING TURNAROUND
		//running --> running_turnaround_start
		else if(this.state === 'running' && horizontalDir === -this.facingDir) {
			this.facingDir = horizontalDir;
			this._setState('running_turnaround_start');
		}
		//running_turnaround_start --> running_turnaround_end
		else if(this.state === 'running_turnaround_start' && horizontalDir === this.facingDir && stateHasLooped) {
			this._setState('running_turnaround_end');
		}
		//running_turnaround_end --> running
		else if(this.state === 'running_turnaround_end' && stateHasLooped) {
			this._setState('running');
		}
		//running_turnaround_start --> standing_turnaround_end
		else if(this.state === 'running_turnaround_start' && horizontalDir !== this.facingDir && stateHasLooped) {
			this._setState('standing_turnaround_end');
		}
		//run_end -(cancel)-> running_turnaround_start
		else if(this.state === 'run_end' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('running_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('running_turnaround_start');
		}
		//run_end -(cancel)-> standing_turnaround_start
		else if(this.state === 'run_end' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//running_turnaround_start -(cancel)-> standing_turnaround_start
		else if(this.state === 'running_turnaround_start' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//running_turnaround_end -(cancels)-> running_turnaround_start
		else if(this.state === 'running_turnaround_end' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('running_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('running_turnaround_start');
		}

		//STANDING <--> CROUCHING
		//standing --> crouch_start
		else if(this.state === 'standing' && verticalDir === -1) {
			this._setState('crouch_start');
		}
		//crouch_start --> crouching
		else if(this.state === 'crouch_start' && stateHasLooped) {
			this._setState('crouching');
		}
		//crouching --> crouch_end
		else if(this.state === 'crouching' && verticalDir !== -1) {
			this._setState('crouch_end');
		}
		//crouch_end --> standing
		else if(this.state === 'crouch_end' && stateHasLooped) {
			this._setState('standing');
		}
		//crouch_start -(cancels)-> crouch_end
		else if(this.state === 'crouch_start' && verticalDir !== -1 && this._stateIsCancelableBy('crouch_end')) {
			this._setState('crouch_end');
		}
		//crouch_end -(cancels)-> run_start
		else if(this.state === 'crouch_end' && horizontalDir === this.facingDir && this._stateIsCancelableBy('run_start')) {
			this._setState('run_start');
		}
		//crouch_end -(cancels)-> standing_turnaround_start
		else if(this.state === 'crouch_end' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//running -(cancels)-> crouch_start
		else if(this.state === 'running' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this._setState('crouch_start');
		}
		//run_end -(cancels)-> crouch_start
		else if(this.state === 'run_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this._setState('crouch_start');
		}
		//running_turnaround_end -(cancels)-> crouch_start
		else if(this.state === 'running_turnaround_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this._setState('crouch_start');
		}
		//standing_turnaround_end -(cancels)-> crouch_start
		else if(this.state === 'standing_turnaround_end' && verticalDir === -1 && this._stateIsCancelableBy('crouch_start')) {
			this._setState('crouch_start');
		}

		//LANDING
		//ground_landing --> standing
		else if(this.state === 'ground_landing' && stateHasLooped) {
			this._setState('standing');
		}

		//JUMPING
		//(many grounded states) --> jump_takeoff
		else if((this.state === 'standing' || this.state === 'running' ||
			this.state === 'standing_turnaround_start' || this.state === 'standing_turnaround_end' ||
			this.state === 'running_turnaround_start' || this.state === 'running_turnaround_end' ||
			this.state === 'crouch_start' || this.state === 'crouching' ||
			this.state === 'crouch_end' || this.state === 'run_start' ||
			this.state === 'run_end') && input && input.key === 'JUMP' && input.isDown) {
			this._setState('jump_takeoff');
		}
		//jump_takeoff --> airborne
		else if(this.state === 'jump_takeoff' && stateHasLooped) {
			this.supportingPlatform = null;
			this.vel.y = -moveData.jump_takeoff.jumpSpeed;
			this._setState('airborne');
		}
		//ground_landing -(cancels)-> jump_takeoff
		if(this.state === 'ground_landing' && this._stateIsCancelableBy('jump_takeoff') &&
			input && input.key === 'JUMP' && input.isDown) {
			this._setState('jump_takeoff');
		}
		//ground_landing -(cancels)-> run_start
		if(this.state === 'ground_landing' && horizontalDir === this.facingDir && this._stateIsCancelableBy('run_start')) {
			this._setState('run_start');
		}
		//ground_landing -(cancels)-> standing_turnaround_start
		if(this.state === 'ground_landing' && horizontalDir === -this.facingDir && this._stateIsCancelableBy('standing_turnaround_start')) {
			this.facingDir = horizontalDir;
			this._setState('standing_turnaround_start');
		}
		//ground_landing -(cancels)-> crouching
		if(this.state === 'ground_landing' && verticalDir === -1 && this._stateIsCancelableBy('crouching')) {
			this._setState('crouching');
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
				this.vel.x = Math.min(0, this.vel.x + deceleration / 60);
			}
		}
		//increase speed while running
		else if(moveData[this.state].physics === 'running') {
			maxSpeed = typeof moveData[this.state].maxSpeed === 'number' ? moveData[this.state].maxSpeed : moveData.running.maxSpeed;
			acceleration = typeof moveData[this.state].acceleration === 'number' ? moveData[this.state].acceleration : moveData.running.acceleration;
			aboveMaxSpeedDeceleration = typeof moveData[this.state].aboveMaxSpeedDeceleration === 'number' ? moveData[this.state].aboveMaxSpeedDeceleration : moveData.running.aboveMaxSpeedDeceleration;
			//if we're running over top speed, slow down (slowly)
			if(this.vel.x * this.facingDir > maxSpeed) {
				this.vel.x -= this.facingDir * aboveMaxSpeedDeceleration / 60;
				if(this.vel.x * this.facingDir < maxSpeed) {
					this.vel.x = this.facingDir * maxSpeed;
				}
			}
			//otherwise, speed up
			else {
				this.vel.x += this.facingDir * acceleration / 60;
				if(this.vel.x * this.facingDir > maxSpeed) {
					this.vel.x = this.facingDir * maxSpeed;
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
					this.vel.x -= aboveMaxSpeedDeceleration / 60;
					if(this.vel.x < maxSpeed) {
						this.vel.x = maxSpeed;
					}
				}
				else {
					//if you're moving above max speed the other way
					if(this.vel.x < -maxSpeed) {
						this.vel.x += Math.max(acceleration, aboveMaxSpeedDeceleration) / 60;
					}
					//if you're moving within reasonable speeds
					else {
						this.vel.x += acceleration / 60;
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
					this.vel.x += aboveMaxSpeedDeceleration / 60;
					if(this.vel.x > -maxSpeed) {
						this.vel.x = -maxSpeed;
					}
				}
				else {
					//if you're moving above max speed the other way
					if(this.vel.x > maxSpeed) {
						this.vel.x -= Math.max(acceleration, aboveMaxSpeedDeceleration) / 60;
					}
					//if you're moving within reasonable speeds
					else {
						this.vel.x -= acceleration / 60;
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
						this.vel.x -= aboveMaxSpeedDeceleration / 60;
					}
					else {
						this.vel.x -= deceleration / 60;
					}
					if(this.vel.x < 0) {
						this.vel.x = 0;
					}
				}
				else if(this.vel.x < 0) {
					if(this.vel.x < -maxSpeed) {
						this.vel.x += aboveMaxSpeedDeceleration / 60;
					}
					else {
						this.vel.x += deceleration / 60;
					}
					if(this.vel.x > 0) {
						this.vel.x = 0;
					}
				}
			}
		}

		//update position
		this.vel.y += gravity / 60;
		var dx = this.vel.x / 60, dy = this.vel.y / 60;
		var steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 5));
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
		var wasAerial = !this.supportingPlatform;
		this.supportingPlatform = null;
		for(i = 0; i < collisions.length; i++) {
			this._handleCollision(collisions[i].platform, collisions[i].dir);
		}
		var isAerial = !this.supportingPlatform;
		//update state due to movement
		if(wasAerial && !isAerial) {
			this._setState('ground_landing');
		}
		else if(!wasAerial && isAerial) {
			this._setState('airborne');
		}

	};
	Fighter.prototype._handleCollision = function(platform, dir) {
		if(dir === 'bottom') {
			this.supportingPlatform = platform;
		}
	};
	Fighter.prototype._setState = function(state, frame) {
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
		draw.sprite('fighter', displayedFrame, this.pos.x, this.pos.y, { flip: this.facingDir < 0 });

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
	};
	return Fighter;
});