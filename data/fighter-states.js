define({
	"standing": {
		"physics": "standing",
		"category": null,
		"loopAnimation": true,
		"conditionsToEnter": function() {
			return !this.isAirborne();
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"standing_turnaround_start": "cancel",
			"run_start": "cancel",
			"crouch_start": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"standing_turnaround_start": {
		"physics": "running",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldHorizontalDir === -this.facing || this.hasBufferedHorizontalDir(-this.facing);
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
			this.facing = -this.facing;
		},
		"effectsOnLeave": null,
		"transitions": {
			"standing_turnaround_end": "follow-up",
			"running_turnaround_end": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"standing_turnaround_end": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": null,
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"standing": "follow-up",
			"standing_turnaround_start": "cancel",
			"crouch_start": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"running": {
		"physics": "running",
		"category": null,
		"loopAnimation": true,
		"conditionsToEnter": null,
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"run_end": "cancel",
			"running_turnaround_start": "cancel",
			"crouch_start": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"run_start": {
		"physics": "running",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldHorizontalDir === this.facing || this.hasBufferedHorizontalDir(this.facing);
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
		},
		"effectsOnLeave": null,
		"transitions": {
			"running": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"run_end": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldHorizontalDir === 0;
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"standing": "follow-up",
			"run_start": "cancel",
			"running_turnaround_start": "cancel",
			"crouch_start": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"running_turnaround_start": {
		"physics": "running",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldHorizontalDir === -this.facing || this.hasBufferedHorizontalDir(-this.facing);
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
			this.facing = -this.facing;
		},
		"effectsOnLeave": null,
		"transitions": {
			"running_turnaround_end": "follow-up",
			"standing_turnaround_end": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"running_turnaround_end": {
		"physics": "running",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldHorizontalDir === this.facing;
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"running": "follow-up",
			"running_turnaround_start": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"airborne": {
		"physics": "airborne",
		"category": null,
		"loopAnimation": true,
		"conditionsToEnter": null,
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"jump_landing": "cancel",
			"airborne_jump": "cancel",
			"dash": "cancel"
		}
	},
	"jump_takeoff": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return !this.isAirborne() && this.hasBufferedAction("JUMP");
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		"effectsOnLeave": function(nextState) {
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
				this.platform = null;
			}
		},
		"transitions": {
			"airborne": "follow-up"
		}
	},
	"jump_landing": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return !this.isAirborne();
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"standing": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"airborne_falloff": {
		"physics": "airborne",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.isAirborne();
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"airborne": "follow-up",
			"dash": "cancel",
			"jump_landing": "cancel"
		}
	},
	"airborne_jump": {
		"physics": "airborne",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.hasBufferedAction("JUMP") &&
				this.framesSinceLastJump > this.getFrameDataValue("framesBetweenJumps") &&
				this.airborneJumpsUsed < this.getFrameDataValue("numAirborneJumps");
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
			this.airborneJumpsUsed++;
			this.clearBufferedAction();
			var stillVelX = 0, stillVelY = 0;
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
		"effectsOnLeave": function(nextState) {
			this.framesSinceLastJump = 0;
		},
		"transitions": {
			"airborne": "follow-up"
		}
	},
	"dash": {
		"physics": "airborne",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.hasBufferedAction("DASH") &&
				this.framesSinceLastDash > this.getFrameDataValue("framesBetweenDashes") &&
				(this.platform || this.airborneJumpsUsed < this.getFrameDataValue("numAirborneJumps"));
		},
		"conditionsToLeave": null,
		"effectsOnEnter": function(prevState, prevFrames) {
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
		"effectsOnLeave": function(nextState) {
			this.framesSinceLastDash = 0;
		},
		"transitions": {
			"standing": "follow-up",
			"airborne": "follow-up",
			"airborne_jump": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"crouching": {
		"physics": "standing",
		"category": null,
		"loopAnimation": true,
		"conditionsToEnter": null,
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"crouch_end": "cancel",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"crouch_start": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldVerticalDir === 1;
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"crouching": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	},
	"crouch_end": {
		"physics": "standing",
		"category": null,
		"loopAnimation": false,
		"conditionsToEnter": function() {
			return this.heldVerticalDir !== 1;
		},
		"conditionsToLeave": null,
		"effectsOnEnter": null,
		"effectsOnLeave": null,
		"transitions": {
			"standing": "follow-up",
			"jump_takeoff": "cancel",
			"dash": "cancel",
			"airborne_falloff": "cancel"
		}
	}
});