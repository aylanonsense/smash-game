define([
	'jquery',
	'util/EventHelper',
	'json!data/fighter-state-list.json'
], function(
	$,
	EventHelper,
	fighterStates
) {
	function StateChooser(params) {
		var self = this;
		this.events = new EventHelper([ 'change' ]);

		//find elements
		this.$ele = params.$ele;

		//load html
		var html = '';
		for(var i = 0; i < fighterStates.length; i++) {
			html += '<option value="' + fighterStates[i] + '">' + fighterStates[i] + '</option>';
		}
		this.$ele.html(html);

		//bind events
		this.$ele.on('change', function() {
			self.events.trigger('change');
		});
	}
	StateChooser.prototype.getState = function() {
		return this.$ele.val();
	};
	StateChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return StateChooser;
});