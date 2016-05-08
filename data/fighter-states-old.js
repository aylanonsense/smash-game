define({
	//standing
	standing: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			run_start: "cancel",
			standing_turnaround_start: "cancel",
			block_start: "cancel",
			crouch_start: "cancel",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	standing_turnaround_start: {
		physics: "running",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === -this.facing || this.hasBufferedHorizontalDir(-this.facing);
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
			this.facing = -this.facing;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			standing_turnaround_start: "frameCancel",
			running_turnaround_end: "next",
			standing_turnaround_end: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	standing_turnaround_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			block_start: "cancel",
			run_start: "frameCancel",
			standing_turnaround_start: "cancel",
			standing: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},


	//running
	running: {
		physics: "running",
		category: null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			block_start: "cancel",
			crouch_start: "cancel",
			run_end: "cancel",
			running_turnaround_start: "cancel",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	run_start: {
		physics: "running",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === this.facing || this.hasBufferedHorizontalDir(this.facing);
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			running_turnaround_start: "frameCancel",
			standing_turnaround_start: "frameCancel",
			run_end_quick: "frameCancel",
			running: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	run_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === 0;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			block_start: "cancel",
			run_start: "frameCancel",
			running_turnaround_start: "frameCancel",
			standing_turnaround_start: "frameCancel",
			standing: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	run_end_quick: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === 0;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			standing: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	running_turnaround_start: {
		physics: "running",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === -this.facing || this.hasBufferedHorizontalDir(-this.facing);
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
			this.facing = -this.facing;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			running_turnaround_end: "next",
			standing_turnaround_end: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	running_turnaround_end: {
		physics: "running",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			grounded_attack_category: "cancel",
			dash: "cancel",
			running_turnaround_start: "cancel",
			running: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},


	//crouching
	crouching: {
		physics: "standing",
		category: null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			block_start: "cancel",
			crouch_end: "cancel",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	crouch_start: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return this.heldVerticalDir === 1;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			block_start: "cancel",
			crouching: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	crouch_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return this.heldVerticalDir !== 1;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			block_start: "cancel",
			standing_turnaround_start: "frameCancel",
			run_start: "frameCancel",
			standing: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},


	//blocking
	blocking: {
		physics: "standing",
		category: null,
		isBlocking: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			block_end: "cancel",
			airborne_block_falloff: "cancel"
		}
	},
	block_start: {
		physics: "standing",
		category: null,
		isBlocking: true,
		conditionsToEnter: function() {
			return this.isHoldingBlock;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			blocking: "next",
			airborne_block_falloff: "cancel"
		}
	},
	block_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingBlock;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			standing: "next",
			airborne_falloff: "cancel"
		}
	},
	block_landing: {
		physics: "standing",
		category: null,
		isBlocking: true,
		conditionsToEnter: function() {
			return !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			blocking: "next"
		}
	},
	airborne_blocking: {
		physics: "airborne",
		category: null,
		isBlocking: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			block_landing: "cancel",
			airborne_block_end: "cancel"
		}
	},
	airborne_block_start: {
		physics: "airborne",
		category: null,
		isBlocking: true,
		conditionsToEnter: function() {
			return this.isHoldingBlock;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_blocking: "next",
			jump_landing: "cancel"
		}
	},
	airborne_block_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingBlock;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne: "next",
			jump_landing: "cancel"
		}
	},
	airborne_block_falloff: {
		physics: "airborne",
		category: null,
		isBlocking: true,
		conditionsToEnter: function() {
			return this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_blocking: "next"
		}
	},

	//jumping/airborne
	jump_takeoff: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("JUMP");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: function(nextState) {
			this.platform = null;
			if(nextState === "airborne") {
				this.framesSinceLastJump = 0;
				var stillVelX = (this.platform ? this.platform.vel.x : 0);
				var stillVelY = (this.platform ? this.platform.vel.y : 0);
				//when jumping off the ground, you can get a little horizontal boost to start you out
				var jumpHorizontalSpeed = this.getFrameDataValue("jumpHorizontalSpeed");
				if(this.heldHorizontalDir !== 0) {
					var m = this.heldHorizontalDir;
					if(this.vel.x * m < stillVelX * m + jumpHorizontalSpeed) {
						this.vel.x = stillVelX + jumpHorizontalSpeed * m;
					}
				}
				this.vel.y = Math.min(this.vel.y, stillVelY - this.getFrameDataValue("jumpSpeed"));
			}
		},
		transitions: {
			pain_category: "cancel",
			airborne: "next",
			airborne_falloff: "cancel"
		}
	},
	jump_landing: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			standing_turnaround_start: "frameCancel",
			run_start: "frameCancel",
			crouch_start: "frameCancel",
			standing: "next",
			jump_takeoff: "cancel",
			airborne_falloff: "cancel"
		}
	},
	airborne: {
		physics: "airborne",
		category: null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel",
			dash: "cancel",
			airborne_block_start: "cancel",
			airborne_jump: "cancel",
			airborne_attack_category: "cancel"
		}
	},
	airborne_jump: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("JUMP") &&
				this.framesSinceLastJump > this.getFrameDataValue("framesBetweenJumps") &&
				this.airborneJumpsUsed < this.getFrameDataValue("numAirborneJumps");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.airborneJumpsUsed++;
			this.clearBufferedAction();
			var stillVelX = (this.platform ? this.platform.vel.x : 0);
			var stillVelY = (this.platform ? this.platform.vel.y : 0);
			//when air jumping, you can get a little horizontal boost to start you out
			var airborneJumpHorizontalSpeed = this.getFrameDataValue("airborneJumpHorizontalSpeed");
			if(this.heldHorizontalDir !== 0) {
				var m = this.heldHorizontalDir;
				if(this.vel.x * m < stillVelX * m + airborneJumpHorizontalSpeed) {
					this.vel.x = stillVelX + airborneJumpHorizontalSpeed * m;
				}
			}
			this.vel.y = Math.min(this.vel.y, stillVelY - this.getFrameDataValue("airborneJumpSpeed"));
			if(this.heldHorizontalDir === -this.facing) {
				this.facing = -this.facing;
			}
		},
		effectsOnLeave: function(nextState) {
			this.framesSinceLastJump = 0;
		},
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel",
			airborne_attack_category: "cancel",
			airborne: "next"
		}
	},
	airborne_falloff: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel",
			dash: "cancel",
			airborne_block_start: "cancel",
			airborne_jump: "cancel",
			airborne_attack_category: "cancel",
			airborne: "next"
		}
	},


	//dashing
	dash: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("DASH") &&
				this.framesSinceLastDash > this.getFrameDataValue("framesBetweenDashes") &&
				(this.platform || this.airborneJumpsUsed < this.getFrameDataValue("numAirborneJumps"));
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.facing = this.bufferedActionDir;
			this.clearBufferedAction();
			var speed = this.getFrameDataValue(this.platform ? "dashSpeed" : "airDashSpeed");
			var m = this.facing;
			var stillVelX = (this.platform ? this.platform.vel.x : 0);
			if(this.vel.x * m < stillVelX + speed) {
				this.vel.x = stillVelX + speed * m;
			}
			this.vel.y = (this.platform ? this.platform.vel.y : 0);
			if(!this.platform) {
				this.airborneJumpsUsed++;
			}
		},
		effectsOnLeave: function(nextState) {
			this.framesSinceLastDash = 0;
		},
		transitions: {
			pain_category: "cancel",
			standing: "next",
			airborne: "next"
		}
	},


	//grounded light attacks
	light_neutral_attack: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_NEUTRAL_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	light_forward_attack: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_FORWARD_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			if(this.bufferedActionDir !== 0) {
				this.facing = this.bufferedActionDir;
			}
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	light_up_attack: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_UP_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	light_down_attack: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_DOWN_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},


	//airborne light attacks
	airborne_light_neutral_attack: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_NEUTRAL_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_light_forward_attack: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_FORWARD_ATTACK") && this.bufferedActionDir === this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_light_back_attack: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_FORWARD_ATTACK") && this.bufferedActionDir !== this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_light_up_attack: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_UP_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_light_down_attack: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("LIGHT_DOWN_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},


	//grounded heavy attacks
	heavy_neutral_attack_start: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_NEUTRAL_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_neutral_attack_charge: "next"
		}
	},
	heavy_neutral_attack_charge: {
		physics: "standing",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_neutral_attack_end: "cancel"
		}
	},
	heavy_neutral_attack_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	heavy_forward_attack_start: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_FORWARD_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			if(this.bufferedActionDir !== 0) {
				this.facing = this.bufferedActionDir;
			}
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_forward_attack_charge: "next"
		}
	},
	heavy_forward_attack_charge: {
		physics: "standing",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_forward_attack_end: "cancel"
		}
	},
	heavy_forward_attack_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	heavy_up_attack_start: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_UP_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_up_attack_charge: "next"
		}
	},
	heavy_up_attack_charge: {
		physics: "standing",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_up_attack_end: "cancel"
		}
	},
	heavy_up_attack_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			standing: "next"
		}
	},
	heavy_down_attack_start: {
		physics: "standing",
		category: "grounded_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_DOWN_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_down_attack_charge: "next"
		}
	},
	heavy_down_attack_charge: {
		physics: "standing",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			heavy_down_attack_end: "cancel"
		}
	},
	heavy_down_attack_end: {
		physics: "standing",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			airborne_falloff: "cancel",
			crouching: "next"
		}
	},


	//airborne heavy attacks
	airborne_heavy_neutral_attack_start: {
		physics: "airborne",
		category: "airborne_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_NEUTRAL_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_neutral_attack_charge: "next"
		}
	},
	airborne_heavy_neutral_attack_charge: {
		physics: "airborne",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_neutral_attack_end: "cancel"
		}
	},
	airborne_heavy_neutral_attack_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_heavy_forward_attack_start: {
		physics: "airborne",
		category: "airborne_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_FORWARD_ATTACK") && this.bufferedActionDir === this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_forward_attack_charge: "next"
		}
	},
	airborne_heavy_forward_attack_charge: {
		physics: "airborne",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_forward_attack_end: "cancel"
		}
	},
	airborne_heavy_forward_attack_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_heavy_back_attack_start: {
		physics: "airborne",
		category: "airborne_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_FORWARD_ATTACK") && this.bufferedActionDir !== this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_back_attack_charge: "next"
		}
	},
	airborne_heavy_back_attack_charge: {
		physics: "airborne",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_back_attack_end: "cancel"
		}
	},
	airborne_heavy_back_attack_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_heavy_up_attack_start: {
		physics: "airborne",
		category: "airborne_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_UP_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_up_attack_charge: "next"
		}
	},
	airborne_heavy_up_attack_charge: {
		physics: "airborne",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_up_attack_end: "cancel"
		}
	},
	airborne_heavy_up_attack_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},
	airborne_heavy_down_attack_start: {
		physics: "airborne",
		category: "airborne_attack_category",
		conditionsToEnter: function() {
			return this.hasBufferedAction("HEAVY_DOWN_ATTACK");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_down_attack_charge: "next"
		}
	},
	airborne_heavy_down_attack_charge: {
		physics: "airborne",
		category: null,
		isCharging: true,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: function() {
			this.framesSpentCharging = 0;
		},
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne_heavy_down_attack_end: "cancel"
		}
	},
	airborne_heavy_down_attack_end: {
		physics: "airborne",
		category: null,
		conditionsToEnter: function() {
			return !this.isHoldingHeavyAttack || this.framesSpentCharging >= this.getFrameDataValue("maxChargeFrames");
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			pain_category: "cancel",
			jump_landing: "cancel", //TODO possibly cancel into attack-specific landing
			airborne: "next"
		}
	},


	//pain
	"pain": {
		physics: "standing",
		category: "pain_category",
		conditionsToEnter: function() {
			return this.framesOfStunLeft > 0 && !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			airborne_paing: "cancel",
			pain_recovery: "cancel"
		}
	},
	"pain_recovery": {
		physics: null,
		category: "pain_category",
		conditionsToEnter: function() {
			return this.framesOfStunLeft === 0;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			airborne_falloff: "next",
			standing: "next"
		}
	},
	"airborne_pain": {
		physics: "airborne",
		category: "pain_category",
		conditionsToEnter: function() {
			return this.framesOfStunLeft > 0 && this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			paing: "cancel",
			airborne_pain_recovery: "cancel"
		}
	},
	"airborne_pain_recovery": {
		physics: null,
		category: "pain_category",
		conditionsToEnter: function() {
			return this.framesOfStunLeft === 0;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			jump_landing: "cancel",
			airborne: "next"
		}
	}
});