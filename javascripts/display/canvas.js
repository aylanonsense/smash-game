define([
	'config'
], function(
	config
) {
	return config.RENDER ? document.getElementById("canvas") : null;
});