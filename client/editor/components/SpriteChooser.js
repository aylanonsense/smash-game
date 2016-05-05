define([
	'jquery',
	'util/EventHelper',
	'json!data/sprites.json'
], function(
	$,
	EventHelper,
	sprites
) {
	function SpriteChooser(params) {
		var self = this;
		this.events = new EventHelper([]);

		//find elements
		this.$ele = params.$ele;

		//load html
		var html = '';
		for(var key in sprites) {
			html += '<option value="' + key + '">' + sprites[key].imagePath + '</option>';
		}
		this.$ele.html(html);
	}
	SpriteChooser.prototype.getSpriteKey = function() {
		return this.$ele.val();
	};
	SpriteChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return SpriteChooser;
});