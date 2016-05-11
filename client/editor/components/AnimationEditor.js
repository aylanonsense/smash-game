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
			var $keyframes = self.$ele.find('.animation-editor-keyframe');
			$keyframes.removeClass('selected');
			$(this).addClass('selected');
			self.events.trigger('cell-selected', $(this).data('col'), $(this).data('row'), $(this).data('hitboxes'), $(this).data('hurtboxes'), $keyframes.index(this));
		});
		this.$ele.on('dblclick', '.animation-editor-keyframe', function() {
			$(this).remove();
			self.events.trigger('cell-deselected');
		});
	}
	AnimationEditor.prototype.loadSprite = function(imageData) {
		this.imageData = imageData;
	};
	AnimationEditor.prototype.addKeyFrame = function(col, row, frames, hitboxes, hurtboxes) {
		this.$ele.find('.animation-editor-keyframe').removeClass('selected');
		var $keyframe = $('<div></div>').addClass('animation-editor-keyframe selected').data({
			col: col,
			row: row,
			hitboxes: hitboxes,
			hurtboxes: hurtboxes
		});
		$('<div></div>').addClass('animation-editor-image').css({
			backgroundImage: 'url(' + this.imageData.sprite.imagePath + ')',
			backgroundSize: (40 * this.imageData.numCols) + 'px ' + (40 * this.imageData.numRows) + 'px',
			backgroundPosition: (-40 * col) + 'px ' + (-40 * row) + 'px'
		}).appendTo($keyframe);
		$('<input type="text">').addClass('animation-editor-frames-input').val('' + frames).appendTo($keyframe);
		$keyframe.appendTo(this.$ele);
		var $keyframes = this.$ele.find('.animation-editor-keyframe');
		this.events.trigger('cell-selected', col, row, $keyframe.data('hitboxes'), $keyframe.data('hurtboxes'), $keyframes.length - 1);
	};
	AnimationEditor.prototype.setHitboxDataForCurrentFrame = function(hitboxes, hurtboxes) {
		var $keyframe = this.$ele.find('.animation-editor-keyframe.selected');
		if($keyframe.length) {
			$keyframe.data('hitboxes', hitboxes);
			if($keyframe.data('hurtboxes') !== 'default') {
				$keyframe.data('hurtboxes', hurtboxes);
			}
		}
	};
	AnimationEditor.prototype.getAnimationData = function() {
		var self = this;
		return this.$ele.find('.animation-editor-keyframe').map(function() {
			return {
				spriteFrame: $(this).data('row') * self.imageData.numCols + $(this).data('col'),
				frames: +$(this).find('.animation-editor-frames-input').val(),
				hitboxes: $(this).data('hitboxes'),
				hurtboxes: $(this).data('hurtboxes')
			};
		}).get();
	};
	AnimationEditor.prototype.setTimeline = function(animation) {
		this.clearTimeline();
		for(var i = 0; i < animation.length; i++) {
			var col = animation[i].spriteFrame % this.imageData.numCols;
			var row = Math.floor(animation[i].spriteFrame / this.imageData.numCols);
			var frames = animation[i].frames;
			this.addKeyFrame(col, row, frames, animation[i].hitboxes, animation[i].hurtboxes);
		}
	};
	AnimationEditor.prototype.clearTimeline = function() {
		this.$ele.empty();
	};
	AnimationEditor.prototype.deselectCell = function() {
		this.$ele.find('.animation-editor-keyframe').removeClass('selected');
		this.events.trigger('cell-deselected');
	};
	AnimationEditor.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	AnimationEditor.prototype.nextKeyframe = function() {
		var $keyframes = this.$ele.find('.animation-editor-keyframe');
		if($keyframes.length > 0) {
			var $keyframe = this.$ele.find('.animation-editor-keyframe.selected');
			var i = ($keyframes.index($keyframe) + 1) % $keyframes.length;
			$keyframe.removeClass('selected');
			$keyframe = $($keyframes[i]);
			$keyframe.addClass('selected');
			this.events.trigger('cell-selected', $keyframe.data('col'), $keyframe.data('row'), $keyframe.data('hitboxes'), $keyframe.data('hurtboxes'), i);
		}
	};
	AnimationEditor.prototype.getNumFramesOfCurrentCell = function() {
		return this.$ele.find('.animation-editor-keyframe.selected .animation-editor-frames-input').val() || 0;
	};
	return AnimationEditor;
});