define([
	'entity/Fighter',
	'util/extend',
	'json!data/generated/frameData.json'
], function(
	Fighter,
	extend,
	frameData
) {
	function Croc(params) {
		Fighter.call(this, extend(params, { frameData: frameData }));
	}
	Croc.prototype = Object.create(Fighter.prototype);
	return Croc;
});