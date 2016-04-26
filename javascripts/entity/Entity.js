define([
	'config',
	'math/Vector',
	'math/Rect'
], function(
	config,
	Vector,
	Rect
) {
	var nextEntityId = 0;
	function Entity(params) {
		params = params || {};
		this._entityId = nextEntityId++;
		this.pos = new Vector(params.x, params.y);
		this.vel = new Vector(params.velX, params.velY);
		this.width = params.width || 50;
		this.height = params.height || 50;
		var insetX = 2 + config.MAX_MOVEMENT_PER_STEP;
		var insetY = 2 + config.MAX_MOVEMENT_PER_STEP;
		this.collisionBoxes = {
			left: new Rect({ parent: this, x: -this.width / 2, y: -this.height + insetY, width: this.width / 2, height: this.height - 2 * insetY }),
			right: new Rect({ parent: this, x: 0, y: -this.height + insetY, width: this.width / 2, height: this.height - 2 * insetY }),
			top: new Rect({ parent: this, x: -this.width / 2 + insetX, y: -this.height, width: this.width - 2 * insetX, height: this.height / 2 }),
			bottom: new Rect({ parent: this, x: -this.width / 2 + insetX, y: -this.height / 2, width: this.width - 2 * insetX, height: this.height / 2 }),
		};
	}
	Entity.prototype.sameAs = function(other) {
		return other && this._entityId === other._entityId;
	};
	Object.defineProperties(Entity.prototype, {
		left: {
			get: function() { return this.collisionBoxes.left.left; },
			set: function(left) { this.pos.x = left + this.width / 2; }
		},
		right: {
			get: function() { return this.collisionBoxes.right.right; },
			set: function(right) { this.pos.x = right - this.width / 2; }
		},
		top: {
			get: function() { return this.collisionBoxes.top.top; },
			set: function(top) { this.pos.y = top + this.height; }
		},
		bottom: {
			get: function() { return this.collisionBoxes.bottom.bottom; },
			set: function(bottom) { this.pos.y = bottom; }
		}
	});
	return Entity;
});