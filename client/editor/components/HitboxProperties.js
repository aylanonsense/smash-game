define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json'
], function(
	$,
	EventHelper,
	fighters
) {
	function HitboxProperties(params) {
		var self = this;
		this.events = new EventHelper([]);

		//variables
		this.$hitbox = null;

		//find elements
		this.$ele = params.$ele;
		this.$knockback = this.$ele.find('input[name="knockback"]');
		this.$direction = this.$ele.find('input[name="direction"]');

		//bind events
		this.$knockback.on('change', function() {
			if(self.$hitbox) {
				self.$hitbox.data('knockback', +self.$knockback.val());
			}
		});
		this.$direction.on('change', function() {
			if(self.$hitbox) {
				self.$hitbox.data('direction', +self.$direction.val());
			}
		});
	}
	HitboxProperties.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	HitboxProperties.prototype.setHitbox = function($hitbox) {
		this.$hitbox = $hitbox;
		this.$knockback.show().val($hitbox.data('knockback'));
		this.$direction.show().val($hitbox.data('direction'));
	};
	HitboxProperties.prototype.clear = function() {
		this.$hitbox = null;
		this.$knockback.hide();
		this.$direction.hide();
	};
	return HitboxProperties;
});