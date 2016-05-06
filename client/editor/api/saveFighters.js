define([
	'jquery',
	'util/EventHelper'
], function(
	$,
	EventHelper
) {
	return function saveFighters(fighters, callback, ctx) {
		console.log('Saving fighters', JSON.stringify(fighters));
		$.ajax({
			url: '/api/fighters',
			method: 'POST',
			data: JSON.stringify(fighters),
			contentType: 'application/json',
		}).done(function(data, status) {
			if(status === 'success') {
				callback.call(ctx, fighters);
			}
			else {
				throw new Error('Error saving fighters');
			}
		}).error(function() {
			throw new Error('Error saving fighters');
		});
	};
});