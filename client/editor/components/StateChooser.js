define([
	'jquery',
	'util/EventHelper',
	'json!data/fighter-states.json'
], function(
	$,
	EventHelper,
	fighterStates
) {
	function StateChooser(params) {
		var self = this;
		this.events = new EventHelper([]);

		//find elements
		this.$ele = params.$ele;

		//load html
		var html = '';
		for(var i = 0; i < fighterStates.length; i++) {
			html += '<option value="' + fighterStates[i] + '">' + fighterStates[i] + '</option>';
		}
		this.$ele.html(html);
	}
	StateChooser.prototype.getState = function() {
		return this.$ele.val();
	};
	StateChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return StateChooser;
});