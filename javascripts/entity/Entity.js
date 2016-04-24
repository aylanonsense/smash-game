define([
	'math/Vector'
], function(
	Vector
) {
	var nextEntityId = 0;
	function Entity(params) {
		params = params || {};
		this._entityId = nextEntityId++;
		this.pos = new Vector(params.x, params.y);
		this.vel = new Vector(params.velX, params.velY);
	}
	Entity.prototype.sameAs = function(other) {
		return other && this._entityId === other._entityId;
	};
	return Entity;
});