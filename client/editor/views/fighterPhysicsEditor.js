define([
	'jquery',
	'util/EventHelper',
	'json!data/fighters.json',
	'editor/components/PhysicsForm',
	'editor/components/StateChooser',
	'editor/components/AnimationEditor',
	'editor/api/saveFighters'
], function(
	$,
	EventHelper,
	fighters,
	PhysicsForm,
	StateChooser,
	AnimationEditor,
	saveFighters
) {
	var events = new EventHelper([]);

	//variables
	var fighterKey = null;
	var state = null;
	var selectedAnimationFrame = null;

	//find elements
	var $page = $('#fighter-physics-editor-page');
	var $saveButton = $page.find('.save-button');

	//instantiate components
	var physicsForm = new PhysicsForm({ $ele: $page.find('.physics-form') });
	var stateChooser = new StateChooser({ $ele: $page.find('.state-chooser') });
	var animationEditor = new AnimationEditor({ $ele: $page.find('.animation-editor') });

	//do some logic
	$page.find('.state-chooser').prepend('<option value="">(fighter defaults)</option');
	state = (stateChooser.getState() === '' ? null : stateChooser.getState());

	//bind events
	stateChooser.on('change', function() {
		persistFighterPhysicsLocally();
		state = (stateChooser.getState() === '' ? null : stateChooser.getState());
		animationEditor.clearTimeline();
		animationEditor.deselectCell();
		if(state) {
			physicsForm.loadFormData(fighters[fighterKey].states[state], fighters[fighterKey]);
			if(fighters[fighterKey].states[state].animation) {
				animationEditor.setTimeline(fighters[fighterKey].states[state].animation);
				animationEditor.deselectCell();
			}
		}
		else {
			physicsForm.loadFormData(fighters[fighterKey]);
		}
	});
	animationEditor.on('cell-selected', function(col, row, hitboxes, hurtboxes, i) {
		persistFighterPhysicsLocally();
		selectedAnimationFrame = i;
		physicsForm.loadFormData(fighters[fighterKey].states[state].animation[selectedAnimationFrame], fighters[fighterKey]);
	});
	animationEditor.on('cell-deselected', function() {
		selectedAnimationFrame = null;
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
						if(selectedAnimationFrame === null) {
							delete fighters[fighterKey].states[state][key];
						}
						else if(fighters[fighterKey].states[state].animation) {
							delete fighters[fighterKey].states[state].animation[selectedAnimationFrame][key];
						}
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
					if(selectedAnimationFrame === null) {
						fighters[fighterKey].states[state][key] = formData[key];
					}
					else if(fighters[fighterKey].states[state].animation) {
						fighters[fighterKey].states[state].animation[selectedAnimationFrame][key] = formData[key];
					}
				}
				else {
					fighters[fighterKey][key] = formData[key];
				}
			}
		}
	}

	return {
		open: function(newFighterKey, imageData) {
			fighterKey = newFighterKey;
			physicsForm.loadFormData(fighters[fighterKey]);
			animationEditor.loadSprite(imageData);
			animationEditor.clearTimeline();
			$page.show();
		},
		on: function(eventName, callback, ctx) {
			return events.on.apply(events, arguments);
		}
	};
});