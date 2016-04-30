define([
	'entity/fighter/Fighter',
	'util/extend',
	'json!data/generated/crocFrameData.json'
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