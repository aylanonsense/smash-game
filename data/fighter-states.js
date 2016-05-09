define({
	"standing": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: function() {
			return !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"standing_turnaround_start": "cancel",
			"run_start": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"standing_turnaround_start": {
		"physics": "running",
		"category": null,
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
			"standing_turnaround_end": "follow-up",
			"running_turnaround_end": "follow-up",
			"jump_takeoff": "cancel"
		}
	},
	"standing_turnaround_end": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"standing": "follow-up",
			"standing_turnaround_start": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"running": {
		"physics": "running",
		"category": null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"run_end": "cancel",
			"running_turnaround_start": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"run_start": {
		"physics": "running",
		"category": null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === this.facing || this.hasBufferedHorizontalDir(this.facing);
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedHorizontalDir();
		},
		effectsOnLeave: null,
		transitions: {
			"running": "follow-up",
			"jump_takeoff": "cancel"
		}
	},
	"run_end": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === 0;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"standing": "follow-up",
			"run_start": "cancel",
			"running_turnaround_start": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"running_turnaround_start": {
		"physics": "running",
		"category": null,
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
			"running_turnaround_end": "follow-up",
			"standing_turnaround_end": "follow-up",
			"jump_takeoff": "cancel"
		}
	},
	"running_turnaround_end": {
		physics: "running",
		category: null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"running": "follow-up",
			"running_turnaround_start": "cancel",
			"jump_takeoff": "cancel"
		}
	},
	"airborne": {
		"physics": "airborne",
		"category": null,
		conditionsToEnter: null,
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"jump_landing": "cancel"
		}
	},
	"jump_takeoff": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: function() {
			return this.hasBufferedAction("JUMP");
		},
		conditionsToLeave: null,
		effectsOnEnter: function(prevState, prevFrames) {
			this.clearBufferedAction();
		},
		effectsOnLeave: function(nextState) {
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
		transitions: {
			"airborne": "follow-up"
		}
	},
	"jump_landing": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: function() {
			return !this.isAirborne();
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"standing": "follow-up",
			"jump_takeoff": "cancel"
		}
	}
});