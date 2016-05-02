define([
	'geom/Rect',
	'display/draw'
], function(
	Rect,
	draw
) {
	function Hitbox(params) {
		Rect.call(this, params);
		this.group = params.group || null;
		this.damage = params.damage || 0;
		this.freeze = params.freeze || 0;
		this.stun = params.stun || 0;
		this.knockback = params.knockback || 0;
		this.angle = params.angle || 0;
	}
	Hitbox.prototype = Object.create(Rect.prototype);
	Hitbox.prototype.render = function() {
		draw.rect(this.left, this.top, this.width, this.height, { fill: 'rgba(255, 0, 0, 0.6)', stroke: 'rgba(255, 0, 0, 1)', thickness: 1 });
	};
	return Hitbox;
});