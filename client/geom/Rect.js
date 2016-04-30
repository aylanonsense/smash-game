define(function() {
	function Rect(params) {
		this.parent = params.parent || null;
		this._offsetLeft = params.x || 0;
		this._offsetTop = params.y || 0;
		this.width = params.width || 0;
		this.height = params.height || 0;
	}
	Rect.prototype.containsPoint = function(x, y) {
		if(arguments.length === 1) { y = x.y; x = x.x; }
		return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
	};
	Rect.prototype.isOverlapping = function(other) {
		return !(this.right < other.left || other.right < this.left ||
			this.bottom < other.top || other.bottom < this.top);
	};
	Object.defineProperties(Rect.prototype, {
		x: {
			get: function() { return (this.parent ? this.parent.pos.x : 0) + this._offsetLeft; },
			set: function(left) {
				if(this.parent) { this.parent.pos.x += left - this.left; }
				else { this._offsetLeft = left; }
			}
		},
		y: {
			get: function() { return (this.parent ? this.parent.pos.y : 0) + this._offsetTop; },
			set: function(top) {
				if(this.parent) { this.parent.pos.y += top - this.top; }
				else { this._offsetTop = top; }
			}
		},
		left: {
			get: function() { return (this.parent ? this.parent.pos.x : 0) + this._offsetLeft; },
			set: function(left) {
				if(this.parent) { this.parent.pos.x += left - this.left; }
				else { this._offsetLeft = left; }
			}
		},
		right: {
			get: function() { return (this.parent ? this.parent.pos.x : 0) + this._offsetLeft + this.width; },
			set: function(right) {
				if(this.parent) { this.parent.pos.x += right - this.right; }
				else { this._offsetLeft = right - this.width; }
			}
		},
		top: {
			get: function() { return (this.parent ? this.parent.pos.y : 0) + this._offsetTop; },
			set: function(top) {
				if(this.parent) { this.parent.pos.y += top - this.top; }
				else { this._offsetTop = top; }
			}
		},
		bottom: {
			get: function() { return (this.parent ? this.parent.pos.y : 0) + this._offsetTop + this.height; },
			set: function(bottom) {
				if(this.parent) { this.parent.pos.y += bottom - this.bottom; }
				else { this._offsetTop = bottom - this.height; }
			}
		}
	});
	return Rect;
});