define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json'
], function(
	$,
	EventHelper,
	fighters
) {
	function FighterChooser(params) {
		var self = this;
		this.events = new EventHelper([]);

		//find elements
		this.$ele = params.$ele;

		//load html
		var html = '';
		for(var key in fighters) {
			html += '<option value="' + key + '">' + key + '</option>';
		}
		this.$ele.html(html);
	}
	FighterChooser.prototype.getFighterKey = function() {
		return this.$ele.val();
	};
	FighterChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return FighterChooser;
});