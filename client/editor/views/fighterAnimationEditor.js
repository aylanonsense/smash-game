define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json',
	'json!data/sprite-hurtboxes.json',
	'editor/components/StateChooser',
	'editor/components/SpriteCellChooser',
	'editor/components/SpriteHitboxCanvas',
	'editor/components/AnimationEditor',
	'editor/components/HitboxProperties',	
	'editor/api/saveFighters'
], function(
	$,
	EventHelper,
	fighters,
	spriteHurtboxes,
	StateChooser,
	SpriteCellChooser,
	SpriteHitboxCanvas,
	AnimationEditor,
	HitboxProperties,	
	saveFighters
) {
	var events = new EventHelper([]);

	//variables
	var fighterKey = null;
	var state = null;
	var isPlayingAnimation = false;
	var framesLeft = 0;

	//find elements
	var $page = $('#fighter-animation-editor-page');
	var $saveButton = $page.find('.save-button');
	var $playAnimationButton = $page.find('.play-animation-button');

	//instantiate components
	var stateChooser = new StateChooser({ $ele: $page.find('.state-chooser') });
	var spriteCellChooser = new SpriteCellChooser({ $ele: $page.find('.sprite-cell-chooser') });
	var spriteHitboxCanvas = new SpriteHitboxCanvas({ $ele: $page.find('.sprite-hitbox-canvas'), 'mode': 'hitbox' });
	var animationEditor = new AnimationEditor({ $ele: $page.find('.animation-editor') });
	var hitboxProperties = new HitboxProperties({ $ele: $page.find('.hitbox-properties') });

	//do some logic
	state = stateChooser.getState();
	setInterval(function() {
		if(isPlayingAnimation) {
			framesLeft--;
			if(framesLeft <= 0) {
				animationEditor.nextKeyframe();
				framesLeft = animationEditor.getNumFramesOfCurrentCell();
			}
		}
	}, 1000 / 60);

	//bind events
	spriteCellChooser.on('cell-selected', function(col, row) {
		animationEditor.addKeyFrame(col, row, 1, [], 'default');
	});
	animationEditor.on('cell-selected', function(col, row, hitboxes, hurtboxes) {
		if(hurtboxes === 'default') {
			hurtboxes = getHurtboxes(spriteHitboxCanvas.imageData, col, row);
		}
		spriteHitboxCanvas.showCell(col, row, hitboxes, hurtboxes);
	});
	animationEditor.on('cell-deselected', function(col, row) {
		spriteHitboxCanvas.clearCanvas();
		hitboxProperties.clear();
	});
	spriteHitboxCanvas.on('hitboxes-edited', function() {
		animationEditor.setHitboxDataForCurrentFrame(spriteHitboxCanvas.getHitboxData(), spriteHitboxCanvas.getHurtboxData());
	});
	stateChooser.on('change', function() {
		persistFighterAnimationLocally();
		animationEditor.clearTimeline();
		spriteHitboxCanvas.clearCanvas();
		state = stateChooser.getState();
		hitboxProperties.clear();
		if(fighters[fighterKey].states[state] && fighters[fighterKey].states[state].animation) {
			animationEditor.setTimeline(fighters[fighterKey].states[state].animation);
		}
	});
	spriteHitboxCanvas.on('hitbox-selected', function($hitbox) {
		if($hitbox.hasClass('hitbox')) {
			hitboxProperties.setHitbox($hitbox);
		}
		else {
			hitboxProperties.clear();
		}
	});
	spriteHitboxCanvas.on('hitbox-deselected', function() {
		hitboxProperties.clear();
	});
	$saveButton.on('click', function() {
		persistFighterAnimationLocally();
		saveFighters(fighters, function() {
			console.log('Save successful!');
		});
	});
	$playAnimationButton.on('click', function() {
		if(isPlayingAnimation) {
			pauseAnimation();
		}
		else {
			playAnimation();
		}
	});

	//helper methods
	function getHurtboxes(imageData, col, row) {
		if(spriteHurtboxes[imageData.spriteKey] && spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col]) {
			return spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col];
		}
		return [];
	}
	function persistFighterAnimationLocally() {
		var animation = animationEditor.getAnimationData();
		if(!fighters[fighterKey].states[state]) {
			fighters[fighterKey].states[state] = {};
		}
		fighters[fighterKey].states[state].animation = animation;
		var totalFrames = 0;
		for(var i = 0; i < animation.length; i++) {
			totalFrames += animation[i].frames;
		}
		fighters[fighterKey].states[state].totalFrames = totalFrames;
	}
	function playAnimation() {
		isPlayingAnimation = true;
		framesLeft = 0;
		$playAnimationButton.text('Pause');
	}
	function pauseAnimation() {
		isPlayingAnimation = false;
		framesLeft = 0;
		$playAnimationButton.text('Play');
	}

	return {
		open: function(newFighterKey, imageData) {
			fighterKey = newFighterKey;
			spriteCellChooser.loadSprite(imageData);
			spriteHitboxCanvas.loadSprite(imageData);
			animationEditor.loadSprite(imageData);
			animationEditor.clearTimeline();
			if(fighters[fighterKey].states[state] && fighters[fighterKey].states[state].animation) {
				animationEditor.setTimeline(fighters[fighterKey].states[state].animation);
			}
			$page.show();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});