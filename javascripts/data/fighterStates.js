define({
	standing: {
		physics: 'standing',
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'run_start', cancel: true },
			{ state: 'standing_turnaround_start', cancel: true },
			{ state: 'block_start', cancel: true },
			{ state: 'crouch_start', cancel: true },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	standing_turnaround_start: {
		physics: 'running',
		conditions: function() {
			return this.horizontalDir === -this.facing ||
				(this.bufferedHorizontalDirectionInput &&
				this.bufferedHorizontalDirectionInput.dir === -this.facing);
		},
		effectsOnEnter: function(prevState, prevFrames) {
			this.bufferedHorizontalDirectionInput = null;
			this.facing = -this.facing;
		},
		effectsOnLeave: null,
		transitions: [
			{ state: 'standing_turnaround_start', frameCancel: true },
			{ state: 'running_turnaround_end' },
			{ state: 'standing_turnaround_end' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	standing_turnaround_end: {
		physics: 'standing',
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'run_start', frameCancel: true },
			{ state: 'standing_turnaround_start', cancel: true },
			{ state: 'standing' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	running: {
		physics: 'running',
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'crouch_start', cancel: true },
			{ state: 'run_end', cancel: true },
			{ state: 'running_turnaround_start', cancel: true },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true },
		]
	},
	run_start: {
		physics: 'running',
		conditions: function() {
			return this.horizontalDir === this.facing ||
				(this.bufferedHorizontalDirectionInput &&
				this.bufferedHorizontalDirectionInput === this.facing);
		},
		effectsOnEnter: function(prevState, prevFrames) {
			this.bufferedHorizontalDirectionInput = null;
		},
		effectsOnLeave: null,
		transitions: [
			{ state: 'running_turnaround_start', frameCancel: true },
			{ state: 'standing_turnaround_start', frameCancel: true },
			{ state: 'run_end_quick', frameCancel: true },
			{ state: 'running' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	run_end: {
		physics: 'standing',
		conditions: function() {
			return this.horizontalDir === 0;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'run_start', frameCancel: true },
			{ state: 'running_turnaround_start', frameCancel: true },
			{ state: 'standing_turnaround_start', frameCancel: true },
			{ state: 'standing' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	run_end_quick: {
		physics: 'standing',
		conditions: function() {
			return this.horizontalDir === 0;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'standing' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	running_turnaround_start: {
		physics: 'running',
		conditions: function() {
			return this.horizontalDir === -this.facing ||
				(this.bufferedHorizontalDirectionInput &&
				this.bufferedHorizontalDirectionInput.dir === -this.facing);
		},
		effectsOnEnter: function(prevState, prevFrames) {
			this.bufferedHorizontalDirectionInput = null;
			this.facing = -this.facing;
		},
		effectsOnLeave: null,
		transitions: [
			{ state: 'running_turnaround_end' },
			{ state: 'standing_turnaround_end' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	running_turnaround_end: {
		physics: 'running',
		conditions: function() {
			return this.horizontalDir === this.facing;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'running_turnaround_start', cancel: true },
			{ state: 'running' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	crouching: {
		physics: 'standing',
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'crouch_end', cancel: true },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	crouch_start: {
		physics: 'standing',
		conditions: function() {
			return this.verticalDir === 1;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'crouching' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	crouch_end: {
		physics: 'standing',
		conditions: function() {
			return this.verticalDir !== 1;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_start', cancel: true },
			{ state: 'standing_turnaround_start', frameCancel: true },
			{ state: 'run_start', frameCancel: true },
			{ state: 'standing' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	blocking: {
		physics: 'standing',
		isBlocking: true,
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_end', cancel: true },
			{ state: 'airborne_block_falloff', cancel: true }
		]
	},
	block_start: {
		physics: 'standing',
		isBlocking: true,
		conditions: function() {
			return this.isHoldingBlock;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'blocking' },
			{ state: 'airborne_block_falloff', cancel: true }
		]
	},
	block_end: {
		physics: 'standing',
		conditions: function() {
			return !this.isHoldingBlock;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'standing' },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	block_landing: {
		physics: 'standing',
		isBlocking: true,
		conditions: function() {
			return this.platform;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'blocking' }
		]
	},
	airborne_blocking: {
		physics: 'airborne',
		isBlocking: true,
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'block_landing', cancel: true },
			{ state: 'airborne_block_end', cancel: true }
		]
	},
	airborne_block_start: {
		physics: 'airborne',
		isBlocking: true,
		conditions: function() {
			return this.isHoldingBlock;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'airborne_blocking' },
			{ state: 'jump_landing', cancel: true }
		]
	},
	airborne_block_end: {
		physics: 'airborne',
		conditions: function() {
			return !this.isHoldingBlock;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'airborne' },
			{ state: 'jump_landing', cancel: true }
		]
	},
	airborne_block_falloff: {
		physics: 'airborne',
		isBlocking: true,
		conditions: function() {
			return !this.platform;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'airborne_blocking' }
		]
	},
	jump_takeoff: {
		physics: 'airborne',
		conditions: function() {
			return this.bufferedActionInput && this.bufferedActionInput.action === 'JUMP';
		},
		effectsOnEnter: function(prevState, prevFrames) {
			this.bufferedActionInput = null;
		},
		effectsOnLeave: function(nextState) {
			this.platform = null;
			if(nextState === 'airborne') {
				var stillVelX = (this.platform ? this.platform.vel.x : 0);
				var stillVelY = (this.platform ? this.platform.vel.y : 0);
				//when jumping off the ground, you can get a little horizontal boost to start you out
				var jumpHorizontalSpeed = this.getFrameDataValue('jumpHorizontalSpeed');
				if(this.horizontalDir !== 0) {
					var m = this.horizontalDir;
					if(this.vel.x * m < stillVelX * m + jumpHorizontalSpeed) {
						this.vel.x = stillVelX + jumpHorizontalSpeed * m;
					}
				}
				this.vel.y = Math.min(this.vel.y, stillVelY - this.getFrameDataValue('jumpSpeed'));
			}
		},
		transitions: [
			{ state: 'airborne' },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	jump_landing: {
		physics: 'standing',
		conditions: function() {
			return this.platform;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'standing_turnaround_start', frameCancel: true },
			{ state: 'run_start', frameCancel: true },
			{ state: 'crouch_start', frameCancel: true },
			{ state: 'standing' },
			{ state: 'jump_takeoff', cancel: true },
			{ state: 'airborne_falloff', cancel: true }
		]
	},
	airborne: {
		physics: 'airborne',
		conditions: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'airborne_block_start', cancel: true },
			{ state: 'jump_landing', cancel: true },
			{ state: 'airborne_jump', cancel: true }
		]
	},
	airborne_jump: {
		physics: 'airborne',
		conditions: function() {
			return (this.state !== 'airborne' || this.framesInCurrentState > 8) &&
				this.bufferedActionInput && this.bufferedActionInput.action === 'JUMP' &&
				this.airborneJumpsUsed < this.getFrameDataValue('numAirborneJumps');
		},
		effectsOnEnter: function(prevState, prevFrames) {
			this.airborneJumpsUsed++;
			this.bufferedActionInput = null;
			var stillVelX = (this.platform ? this.platform.vel.x : 0);
			var stillVelY = (this.platform ? this.platform.vel.y : 0);
			//when air jumping, you can get a little horizontal boost to start you out
			var airborneJumpHorizontalSpeed = this.getFrameDataValue('airborneJumpHorizontalSpeed');
			if(this.horizontalDir !== 0) {
				var m = this.horizontalDir;
				if(this.vel.x * m < stillVelX * m + airborneJumpHorizontalSpeed) {
					this.vel.x = stillVelX + airborneJumpHorizontalSpeed * m;
				}
			}
			this.vel.y = Math.min(this.vel.y, stillVelY - this.getFrameDataValue('airborneJumpSpeed'));
			if(this.horizontalDir === -this.facing) {
				this.facing = -this.facing;
			}
		},
		effectsOnLeave: null,
		transitions: [
			{ state: 'jump_landing', cancel: true },
			{ state: 'airborne' }
		]
	},
	airborne_falloff: {
		physics: 'airborne',
		conditions: function() {
			return !this.platform;
		},
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: [
			{ state: 'airborne_block_start', cancel: true },
			{ state: 'airborne_jump', cancel: true },
			{ state: 'airborne' }
		]
	}
});