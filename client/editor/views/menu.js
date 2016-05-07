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
	var events = new EventHelper([ 'play-game', 'edit-fighter-physics', 'edit-fighter-animations', 'edit-hurtboxes' ]);

	//find elements
	var $page = $('#menu-page');
	var $playGameButton = $page.find('.play-game-button');
	var $editFighterPhysicsButton = $page.find('.edit-fighter-physics-button');
	var $editFighterAnimationsButton = $page.find('.edit-fighter-animations-button');
	var $editHurtboxesButton = $page.find('.edit-hurtboxes-button');

	//instantiate components
	var playerFighterChooser = new FighterChooser({ $ele: $page.find('.player-fighter-chooser') });
	var npcFighterChooser = new FighterChooser({ $ele: $page.find('.npc-fighter-chooser') });
	var physicsFighterChooser = new FighterChooser({ $ele: $page.find('.physics-fighter-chooser') });
	var animationFighterChooser = new FighterChooser({ $ele: $page.find('.animation-fighter-chooser') });
	var spriteChooser = new SpriteChooser({ $ele: $page.find('.sprite-chooser') });

	//bind events
	$playGameButton.on('click', function() {
		events.trigger('play-game', playerFighterChooser.getFighterKey(), npcFighterChooser.getFighterKey());
	});
	$editFighterPhysicsButton.on('click', function() {
		events.trigger('edit-fighter-physics', physicsFighterChooser.getFighterKey());
	});
	$editFighterAnimationsButton.on('click', function() {
		events.trigger('edit-fighter-animations', animationFighterChooser.getFighterKey());
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