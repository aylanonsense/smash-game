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
		this.facingDir = params.facing || 0;
		this.state = 'standing';
		this.framesInCurrentState = 0;
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

		else {
			return false;
		}
		return true;
	};
	Fighter.prototype.move = function(t) {
		//slide to a stop while standing
		if(this.state === 'standing' || this.state === 'crouch_start' ||
			this.state === 'crouching' || this.state === 'crouch_end' || this.state === 'run_end' ||
			this.state === 'standing_turnaround_end') {
			if(this.vel.x > 0) {
				this.vel.x = Math.max(0, this.vel.x - moveData.standing.deceleration / 60);
			}
			else if(this.vel.x < 0) {
				this.vel.x = Math.min(0, this.vel.x + moveData.standing.deceleration / 60);
			}
		}
		//increase speed while running
		else if(this.state === 'run_start' || this.state === 'running' ||
			this.state === 'running_turnaround_end') {
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
		else if(this.state === 'standing_turnaround_start' || this.state === 'running_turnaround_start') {
			//if we're running over top speed, slow down (slowly)
			if(this.vel.x * this.facingDir > moveData[this.state].maxSpeed) {
				this.vel.x -= this.facingDir * moveData[this.state].deceleration / 60;
				if(this.vel.x * this.facingDir < moveData[this.state].maxSpeed) {
					this.vel.x = this.facingDir * moveData[this.state].maxSpeed;
				}
			}
			//otherwise, speed up
			else {
				this.vel.x += this.facingDir * moveData[this.state].acceleration / 60;
				if(this.vel.x * this.facingDir > moveData[this.state].maxSpeed) {
					this.vel.x = this.facingDir * moveData[this.state].maxSpeed;
				}
			}
		}
		else {
			console.log(this.state + ' has no physics associated with it');
		}
		this.pos.x += this.vel.x / 60;
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
		draw.sprite('fighter', displayedFrame, this.pos.x, this.pos.y, { flip: this.facingDir < 0 });
		draw.text(this.state, this.pos.x, this.pos.y + 15, { fontSize: 14, color: '#fff', align: 'center' });
		draw.text('(frame ' + (this.framesInCurrentState + 1) + ')', this.pos.x, this.pos.y + 25, { fontSize: 10, color: '#aaa', align: 'center' });
	};
	return Fighter;
});