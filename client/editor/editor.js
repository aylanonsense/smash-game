define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json',
	'json!data/sprites.json',
	'editor/views/menu',
	'editor/views/fighterPhysicsEditor',
	'editor/views/fighterAnimationEditor',
	'editor/views/hurtboxEditor'
], function(
	$,
	EventHelper,
	fighters,
	sprites,
	menu,
	fighterPhysicsEditor,
	fighterAnimationEditor,
	hurtboxEditor
) {
	var events = new EventHelper([ 'play-game' ]);

	//find elements
	var $canvas = $('#canvas');
	var $editor = $('#editor');

	//bind events
	menu.on('play-game', function(playerFighterKey, npcFighterKey) {
		events.trigger('play-game', playerFighterKey, npcFighterKey);
	});
	menu.on('edit-fighter-physics', function(fighterKey) {
		menu.close();
		var spriteKey = fighters[fighterKey].spriteKey;
		var image = new Image();
		image.onload = function() {
			fighterPhysicsEditor.open(fighterKey, {
				spriteKey: spriteKey,
				sprite: sprites[spriteKey],
				image: image,
				width: image.width,
				height: image.height,
				numCols: image.width / sprites[spriteKey].frameWidth,
				numRows: image.height / sprites[spriteKey].frameHeight
			});
		};
		image.src = sprites[spriteKey].imagePath;
	});
	menu.on('edit-fighter-animations', function(fighterKey) {
		menu.close();
		var spriteKey = fighters[fighterKey].spriteKey;
		var image = new Image();
		image.onload = function() {
			fighterAnimationEditor.open(fighterKey, {
				spriteKey: spriteKey,
				sprite: sprites[spriteKey],
				image: image,
				width: image.width,
				height: image.height,
				numCols: image.width / sprites[spriteKey].frameWidth,
				numRows: image.height / sprites[spriteKey].frameHeight
			});
		};
		image.src = sprites[spriteKey].imagePath;
	});
	menu.on('edit-hurtboxes', function(spriteKey) {
		menu.close();
		var image = new Image();
		image.onload = function() {
			hurtboxEditor.open({
				spriteKey: spriteKey,
				sprite: sprites[spriteKey],
				image: image,
				width: image.width,
				height: image.height,
				numCols: image.width / sprites[spriteKey].frameWidth,
				numRows: image.height / sprites[spriteKey].frameHeight
			});
		};
		image.src = sprites[spriteKey].imagePath;
	});

	return {
		open: function() {
			$canvas.hide();
			$editor.show();
			menu.open();
		},
		close: function() {
			menu.close();
			$editor.hide();
			$canvas.show();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});