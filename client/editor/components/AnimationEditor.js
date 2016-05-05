define([
	'jquery',
	'util/EventHelper'
], function(
	$,
	EventHelper
) {
	function AnimationEditor(params) {
		var self = this;
		this.events = new EventHelper([ 'cell-selected', 'cell-deselected' ]);

		//variables
		this.imageData = null;

		//find elements
		this.$ele = params.$ele;

		//bind events
		this.$ele.on('click', '.animation-editor-keyframe', function() {
			self.$ele.find('.animation-editor-keyframe').removeClass('selected');
			$(this).addClass('selected');
			self.events.trigger('cell-selected', $(this).data('col'), $(this).data('row'));
		});
		this.$ele.on('dblclick', '.animation-editor-keyframe', function() {
			$(this).remove();
			self.events.trigger('cell-deselected');
		});
	}
	AnimationEditor.prototype.loadSprite = function(imageData) {
		this.imageData = imageData;
	};
	AnimationEditor.prototype.addKeyFrame = function(col, row, frames) {
		var $keyframe = $('<div></div>').addClass('animation-editor-keyframe').data({
			col: col,
			row: row
		});
		$('<div></div>').addClass('animation-editor-image').css({
			backgroundImage: 'url(' + this.imageData.sprite.imagePath + ')',
			backgroundSize: (40 * this.imageData.numCols) + 'px ' + (40 * this.imageData.numRows) + 'px',
			backgroundPosition: (-40 * col) + 'px ' + (-40 * row) + 'px'
		}).appendTo($keyframe);
		$('<input type="text">').addClass('animation-editor-frames-input').val('' + frames).appendTo($keyframe);
		$keyframe.appendTo(this.$ele);
	};
	AnimationEditor.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return AnimationEditor;
});