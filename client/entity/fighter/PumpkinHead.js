define([
	'entity/fighter/Fighter',
	'util/extend',
	'json!data/generated/pumpkinHeadFrameData.json'
], function(
	Fighter,
	extend,
	frameData
) {
	function PumpkinHead(params) {
		Fighter.call(this, extend(params, { frameData: frameData }));
	}
	PumpkinHead.prototype = Object.create(Fighter.prototype);
	return PumpkinHead;
});