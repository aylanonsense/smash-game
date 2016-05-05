define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json',
	'json!data/sprite-hurtboxes.json',
	'editor/components/StateChooser',
	'editor/components/SpriteCellChooser',
	'editor/components/SpriteHitboxCanvas',
	'editor/components/AnimationEditor'
], function(
	$,
	EventHelper,
	fighters,
	spriteHurtboxes,
	StateChooser,
	SpriteCellChooser,
	SpriteHitboxCanvas,
	AnimationEditor
) {
	var events = new EventHelper([]);

	//find elements
	var $page = $('#fighter-animation-editor-page');
	var $saveButton = $page.find('.save-button');

	//instantiate components
	var stateChooser = new StateChooser({ $ele: $page.find('.state-chooser') });
	var spriteCellChooser = new SpriteCellChooser({ $ele: $page.find('.sprite-cell-chooser') });
	var spriteHitboxCanvas = new SpriteHitboxCanvas({ $ele: $page.find('.sprite-hitbox-canvas') });
	var animationEditor = new AnimationEditor({ $ele: $page.find('.animation-editor') });

	//bind events
	spriteCellChooser.on('cell-selected', function(col, row) {
		animationEditor.addKeyFrame(col, row, 1);
	});
	animationEditor.on('cell-selected', function(col, row) {
		var defaultHurtboxes = getHurtboxes(spriteHitboxCanvas.imageData, col, row);
		spriteHitboxCanvas.showCell(col, row, defaultHurtboxes);
	});
	animationEditor.on('cell-deselected', function(col, row) {
		spriteHitboxCanvas.clearCanvas();
	});
	spriteHitboxCanvas.on('hitboxes-edited', function() {
		// animationEditor.setHitboxDataForCurrentFrame(); //TODO get data
	});

	//helper methods
	function getHurtboxes(imageData, col, row) {
		if(spriteHurtboxes[imageData.spriteKey] && spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col]) {
			return spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col];
		}
		return [];
	}
	return {
		open: function(fighterKey, imageData) {
			spriteCellChooser.loadSprite(imageData);
			spriteHitboxCanvas.loadSprite(imageData);
			animationEditor.loadSprite(imageData);
			$page.show();
		},
		close: function() {
			//persistHurtboxesLocally();
			$page.hide();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});