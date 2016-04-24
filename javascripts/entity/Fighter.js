define([
	'entity/Entity',
	'util/extend',
	'entity/moveData',
	'display/draw'
], function(
	Entity,
	extend,
	moveData,
	draw
) {
	function Fighter(params) {
		Entity.call(this, extend(params, {}));
		this.inputState = params.inputState;
		this.facingDir = 1;
		this.state = 'standing'; //states: standing, running
		this.framesInCurrentState = 0;
	}
	Fighter.prototype = Object.create(Entity.prototype);
	Fighter.prototype.startOfFrame = function(t) {
		this.framesInCurrentState++;
	};
	Fighter.prototype.handleInput = function(inputs, inputState) {
		for(var i = 0; i < inputs.length; i++) {
			this.inputState = inputs[i].state;
			this._updateState(inputs[i]);
		}
		this.inputState = inputState;
		this._updateState(null);
	};
	Fighter.prototype._updateState = function(input) {
		//crouch_start -> crouching
		if(this.state === 'crouch_start' && this.framesInCurrentState >= moveData.crouch_start.totalFrames) {
			this._setState('crouching');
		}

		//crouch_end -> standing
		if(this.state === 'crouch_end' && this.framesInCurrentState >= moveData.crouch_end.totalFrames) {
			this._setState('standing');
		}

		//run_end -> standing
		if(this.state === 'run_end' && this.framesInCurrentState >= moveData.run_end.totalFrames) {
			this._setState('standing');
		}

		//crouching -> crouch_end
		if(this.state === 'crouching' && this.inputState.verticalDir >= 0 &&
			(!input || input.change === 'verticalDir')) {
			this._setState('crouch_end');
		}

		//standing -> crouch_start
		if(this.state === 'standing' && this.inputState.verticalDir < 0 &&
			(!input || input.change === 'verticalDir')) {
			this._setState('crouch_start');
		}

		//standing -> running
		if(this.state === 'standing' && this.inputState.horizontalDir !== 0 &&
			(!input || input.change === 'horizontalDir')) {
			this._setState('running');
			this.facingDir = this.inputState.horizontalDir;
		}

		//running -> run_end
		if(this.state === 'running' && this.inputState.horizontalDir === 0 &&
			(!input || input.change === 'horizontalDir')) {
			this._setState('run_end');
		}
	};
	Fighter.prototype.move = function(t) {
		//slide to a stop while standing
		if(this.state === 'standing' || this.state === 'crouch_start' ||
			this.state === 'crouching' || this.state === 'crouch_end' || this.state === 'run_end') {
			if(this.vel.x > 0) {
				this.vel.x = Math.max(0, this.vel.x - moveData.standing.deceleration / 60);
			}
			else if(this.vel.x < 0) {
				this.vel.x = Math.min(0, this.vel.x + moveData.standing.deceleration / 60);
			}
		}
		//increase speed while running
		else if(this.state === 'running') {
			//if we're running over top speed, slow down (slowly)
			if(this.vel.x * this.facingDir > moveData.running.maxSpeed) {
				this.vel.x -= this.facingDir * moveData.running.deceleration / 60;
				if(this.vel.x * this.facingDir < moveData.running.maxSpeed) {
					this.vel.x = this.facingDir * moveData.running.maxSpeed;
				}
			}
			//otherwise, speed up
			else {
				this.vel.x += this.facingDir * moveData.running.acceleration / 60;
				if(this.vel.x * this.facingDir > moveData.running.maxSpeed) {
					this.vel.x = this.facingDir * moveData.running.maxSpeed;
				}
			}
		}
		this.pos.x += this.vel.x / 60;
	};
	Fighter.prototype._setState = function(state) {
		this.state = state;
		this.framesInCurrentState = 0;
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
		var colors = {
			standing: '#f00',
			running: '#00f'
		};
		draw.sprite('fighter', displayedFrame, this.pos.x, this.pos.y, { flip: this.facingDir < 0 });
	};
	return Fighter;
});