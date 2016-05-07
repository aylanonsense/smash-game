define([
	'jquery',
	'util/EventHelper',
	'json!data/sprite-hurtboxes.json',
	'editor/components/SpriteCellChooser',
	'editor/components/SpriteHitboxCanvas',
	'editor/api/saveSpriteHurtboxes'
], function(
	$,
	EventHelper,
	spriteHurtboxes,
	SpriteCellChooser,
	SpriteHitboxCanvas,
	saveSpriteHurtboxes
) {
	var events = new EventHelper([]);

	//find elements
	var $page = $('#hurtbox-editor-page');
	var $saveButton = $page.find('.save-button');

	//instantiate components
	var spriteCellChooser = new SpriteCellChooser({ $ele: $page.find('.sprite-cell-chooser') });
	var spriteHitboxCanvas = new SpriteHitboxCanvas({ $ele: $page.find('.sprite-hitbox-canvas'), mode: 'hurtbox' });

	//bind events
	spriteCellChooser.on('cell-selected', function(col, row) {
		persistHurtboxesLocally();
		var hurtboxes = getHurtboxes(spriteHitboxCanvas.imageData, col, row);
		spriteHitboxCanvas.showCell(col, row, [], hurtboxes);
	});
	$saveButton.on('click', function() {
		persistHurtboxesLocally();
		saveSpriteHurtboxes(spriteHurtboxes, function() {
			console.log("Save successful!");
		});
	});

	//helper methods
	function getHurtboxes(imageData, col, row) {
		if(spriteHurtboxes[imageData.spriteKey] && spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col]) {
			return spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col];
		}
		return [];
	}
	function persistHurtboxesLocally() {
		if(spriteHitboxCanvas.isEditingCell()) {
			var imageData = spriteHitboxCanvas.imageData;
			var col = spriteHitboxCanvas.col;
			var row = spriteHitboxCanvas.row;
			var hurtboxes = spriteHitboxCanvas.getHurtboxData();
			if(!spriteHurtboxes[imageData.spriteKey]) {
				spriteHurtboxes[imageData.spriteKey] = [];
			}
			spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col] = hurtboxes;
		}
	}

	return {
		open: function(imageData) {
			spriteCellChooser.loadSprite(imageData);
			spriteHitboxCanvas.loadSprite(imageData);
			$page.show();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});