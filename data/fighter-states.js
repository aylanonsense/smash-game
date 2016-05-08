define({
	"standing": {
		"physics": "standing",
		"category": null,
		conditionsToEnter: null,//return !this.isAirborne();
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"standing_turnaround_start": "cancel",
			"run_start": "cancel"
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
			"running_turnaround_end": "follow-up"
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
			"standing_turnaround_start": "cancel"
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
			"running_turnaround_start": "cancel"
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
			"running": "follow-up"
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
			"running_turnaround_start": "cancel"
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
			"standing_turnaround_end": "follow-up"
		}
	},
	"running_turnaround_end": {
		"physics": "running",
		"category": null,
		conditionsToEnter: function() {
			return this.heldHorizontalDir === this.facing;
		},
		conditionsToLeave: null,
		effectsOnEnter: null,
		effectsOnLeave: null,
		transitions: {
			"running": "follow-up",
			"running_turnaround_start": "cancel"
		}
	}
});