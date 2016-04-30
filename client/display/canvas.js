define([
	'json!data/config.json'
], function(
	config
) {
	return config.RENDER ? document.getElementById('canvas') : null;
});