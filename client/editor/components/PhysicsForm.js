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
		this.$labels = this.$ele.find('label');
	}
	FighterChooser.prototype.getFormData = function() {
		var formData = {};
		this.$labels.map(function() {
			var $input = $(this).find('input');
			var name = $input.attr('name');
			var value = $input.val() === '' ? null : +$input.val();
			formData[name] = value;
		});
		return formData;
	};
	FighterChooser.prototype.loadFormData = function(data, defaultData) {
		this.$labels.each(function() {
			var $input = $(this).find('input');
			var $default = $(this).find('.default-value');
			var name = $input.attr('name');
			if(data && (data[name] || data[name] === 0)) {
				$input.val(data[name]);
			}
			else {
				$input.val('');
			}
			if(defaultData && (defaultData[name] || defaultData[name] === 0)) {
				$default.text('(' + defaultData[name] + ')');
			}
			else {
				$default.text('--');
			}
		});
	};
	FighterChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return FighterChooser;
});