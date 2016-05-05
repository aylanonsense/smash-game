define([
	'jquery',
	'util/EventHelper',
	'json!data/sprites.json',
	'editor/components/FighterChooser',
	'editor/components/SpriteChooser'
], function(
	$,
	EventHelper,
	sprites,
	FighterChooser,
	SpriteChooser
) {
	var events = new EventHelper([ 'edit-fighter-animations', 'edit-hurtboxes' ]);

	//find elements
	var $page = $('#menu-page');
	var $editFighterAnimationsButton = $page.find('.edit-fighter-animations-button');
	var $editHurtboxesButton = $page.find('.edit-hurtboxes-button');

	//instantiate components
	var fighterChooser = new FighterChooser({ $ele: $page.find('.fighter-chooser') });
	var spriteChooser = new SpriteChooser({ $ele: $page.find('.sprite-chooser') });

	//bind events
	$editFighterAnimationsButton.on('click', function() {
		events.trigger('edit-fighter-animations', fighterChooser.getFighterKey());
	});
	$editHurtboxesButton.on('click', function() {
		events.trigger('edit-hurtboxes', spriteChooser.getSpriteKey());
	});

	return {
		open: function() {
			$page.show();
		},
		close: function() {
			$page.hide();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});