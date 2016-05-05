define([
	'jquery',
	'util/EventHelper'
], function(
	$,
	EventHelper
) {
	return function saveSpriteHurtboxes(spriteHurtboxes, callback, ctx) {
		console.log('Saving sprite hurtboxes', JSON.stringify(spriteHurtboxes));
		$.ajax({
			url: '/api/sprite-hurtboxes',
			method: 'POST',
			data: JSON.stringify(spriteHurtboxes),
			contentType: 'application/json',
		}).done(function(data, status) {
			if(status === 'success') {
				callback.call(ctx, spriteHurtboxes);
			}
			else {
				throw new Error('Error saving sprite hurtboxes');
			}
		}).error(function() {
			throw new Error('Error saving sprite hurtboxes');
		});
	};
});