define([
	'geom/Rect',
	'display/draw'
], function(
	Rect,
	draw
) {
	function Hurtbox(params) {
		Rect.call(this, params);
	}
	Hurtbox.prototype = Object.create(Rect.prototype);
	Hurtbox.prototype.render = function() {
		draw.rect(this.left, this.top, this.width, this.height, { fill: 'rgba(255, 255, 0, 0.6)', stroke: 'rgba(255, 255, 0, 1)', thickness: 1 });
	};
	return Hurtbox;
});