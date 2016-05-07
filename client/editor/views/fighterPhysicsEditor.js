define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json',
	'editor/components/PhysicsForm',
	'editor/components/StateChooser',
	'editor/api/saveFighters'
], function(
	$,
	EventHelper,
	fighters,
	PhysicsForm,
	StateChooser,
	saveFighters
) {
	var events = new EventHelper([]);

	//variables
	var fighterKey = null;
	var state = null;

	//find elements
	var $page = $('#fighter-physics-editor-page');
	var $saveButton = $page.find('.save-button');

	//instantiate components
	var physicsForm = new PhysicsForm({ $ele: $page.find('.physics-form') });
	var stateChooser = new StateChooser({ $ele: $page.find('.state-chooser') });

	//do some logic
	$page.find('.state-chooser').prepend('<option value="">(fighter defaults)</option');
	state = (stateChooser.getState() === '' ? null : stateChooser.getState());

	//bind events
	stateChooser.on('change', function() {
		persistFighterPhysicsLocally();
		state = (stateChooser.getState() === '' ? null : stateChooser.getState());
		if(state) {
			physicsForm.loadFormData(fighters[fighterKey].states[state], fighters[fighterKey]);
		}
		else {
			physicsForm.loadFormData(fighters[fighterKey]);
		}
	});
	$saveButton.on('click', function() {
		persistFighterPhysicsLocally();
		saveFighters(fighters, function() {
			console.log('Save successful!');
		});
	});

	//helper methods
	function persistFighterPhysicsLocally() {
		var formData = physicsForm.getFormData();
		for(var key in formData) {
			if(formData[key] === null) {
				if(state) {
					if(fighters[fighterKey].states[state]) {
						delete fighters[fighterKey].states[state][key];
					}
				}
				else {
					delete fighters[fighterKey][key];
				}
			}
			else {
				if(state) {
					if(!fighters[fighterKey].states[state]) {
						fighters[fighterKey].states[state] = {};
					}
					fighters[fighterKey].states[state][key] = formData[key];
				}
				else {
					fighters[fighterKey][key] = formData[key];
				}
			}
		}
	}
	/*function getHurtboxes(imageData, col, row) {
		if(spriteHurtboxes[imageData.spriteKey] && spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col]) {
			return spriteHurtboxes[imageData.spriteKey][row * imageData.numCols + col];
		}
		return [];
	}
	function persistFighterAnimationLocally() {
		if(!fighters[fighterKey].states[state]) {
			fighters[fighterKey].states[state] = {};
		}
		fighters[fighterKey].states[state].animation = animationEditor.getAnimationData();
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
	}*/

	return {
		open: function(newFighterKey, imageData) {
			fighterKey = newFighterKey;
			physicsForm.loadFormData(fighters[fighterKey]);
			/*spriteCellChooser.loadSprite(imageData);
			spriteHitboxCanvas.loadSprite(imageData);
			animationEditor.loadSprite(imageData);
			animationEditor.clearTimeline();
			if(fighters[fighterKey].states[state] && fighters[fighterKey].states[state].animation) {
				animationEditor.setTimeline(fighters[fighterKey].states[state].animation);
			}*/
			$page.show();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});