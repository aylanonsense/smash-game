define([
	'entity/Fighter',
	'util/extend',
	'data/crocFrameData'
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