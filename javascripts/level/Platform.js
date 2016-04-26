define([
	'math/Vector',
	'display/draw'
], function(
	Vector,
	draw
) {
	function Platform(params) {
		this.pos = new Vector(params.x, params.y);
		this.vel = new Vector(params.velX, params.velY);
		this.width = params.width;
		this.height = params.height;
	}
	Platform.prototype.move = function() {
		this.pos.x += this.vel.x / 60;
		this.pos.y += this.vel.y / 60;
	};
	Platform.prototype.render = function() {
		draw.rect(this.pos.x, this.pos.y, this.width, this.height, { fill: '#900' });
	};
	Object.defineProperties(Platform.prototype, {
		left: {
			get: function() { return this.pos.x; },
			set: function(x) { this.pos.x = x; }
		},
		right: {
			get: function() { return this.pos.x + this.width; },
			set: function(x) { this.pos.x = x - this.width; }
		},
		top: {
			get: function() { return this.pos.y; },
			set: function(y) { this.pos.y = y; }
		},
		bottom: {
			get: function() { return this.pos.y + this.height; },
			set: function(y) { this.pos.y = y - this.height; }
		}
	});
	return Platform;
});