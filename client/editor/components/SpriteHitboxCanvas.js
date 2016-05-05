define([
	'jquery',
	'util/EventHelper'
], function(
	$,
	EventHelper
) {
	var CANVAS_WIDTH = 600, CANVAS_HEIGHT = 600;

	function SpriteHitboxCanvas(params) {
		var self = this;
		this.events = new EventHelper([ 'hitboxes-edited' ]);

		//variables
		this.imageData = null;
		this.pixelWidth = null;
		this.pixelHeight = null;
		this.col = null;
		this.row = null;

		//find elements
		this.$ele = params.$ele;
		this.$image = this.$ele.find('.sprite-hitbox-canvas-image');
		this.$hurtboxes = this.$ele.find('.sprite-hitbox-canvas-hurtboxes');
		this.$hitboxBeingEdited = null;

		//bind events
		this.$hurtboxes.on('mousedown', function(evt) {
			if(self.isEditingCell() && evt.target === self.$hurtboxes[0]) {
				var pixelX = Math.floor(evt.offsetX / self.pixelWidth);
				var pixelY = Math.floor(evt.offsetY / self.pixelHeight);
				self.$hitboxBeingEdited = $('<div></div>').addClass('hurtbox being-edited').css({
					left: pixelX * self.pixelWidth,
					top: pixelY * self.pixelHeight,
					width: self.pixelWidth,
					height: self.pixelHeight
				}).data({ startX: pixelX, startY: pixelY }).appendTo(self.$hurtboxes);
			}
		});
		this.$hurtboxes.on('mousemove', function(evt) {
			if(self.isEditingCell() && self.$hitboxBeingEdited) {
				var offsetX = evt.offsetX;
				var offsetY = evt.offsetY;
				if(evt.target !== self.$hurtboxes[0]) {
					offsetX += $(evt.target).position().left;
					offsetY += $(evt.target).position().top;
				}
				var pixelX = Math.floor(offsetX / self.pixelWidth);
				var pixelY = Math.floor(offsetY / self.pixelHeight);
				var startX = self.$hitboxBeingEdited.data('startX');
				var startY = self.$hitboxBeingEdited.data('startY');
				self.$hitboxBeingEdited.css({
					left: Math.min(pixelX, startX) * self.pixelWidth,
					top: Math.min(pixelY, startY) * self.pixelHeight,
					width: (Math.abs(pixelX - startX) + 1) * self.pixelWidth,
					height: (Math.abs(pixelY - startY) + 1) * self.pixelHeight
				}).data({ endX: pixelX, endY: pixelY });
			}
		});
		this.$hurtboxes.on('mouseup', function(evt) {
			if(self.isEditingCell() && self.$hitboxBeingEdited) {
				var offsetX = evt.offsetX;
				var offsetY = evt.offsetY;
				if(evt.target !== self.$hurtboxes[0]) {
					offsetX += $(evt.target).position().left;
					offsetY += $(evt.target).position().top;
				}
				var pixelX = Math.floor(offsetX / self.pixelWidth);
				var pixelY = Math.floor(offsetY / self.pixelHeight);
				var startX = self.$hitboxBeingEdited.data('startX');
				var startY = self.$hitboxBeingEdited.data('startY');
				self.$hitboxBeingEdited.css({
					left: Math.min(pixelX, startX) * self.pixelWidth,
					top: Math.min(pixelY, startY) * self.pixelHeight,
					width: (Math.abs(pixelX - startX) + 1) * self.pixelWidth,
					height: (Math.abs(pixelY - startY) + 1) * self.pixelHeight
				}).data({ endX: pixelX, endY: pixelY }).removeClass('being-edited');
				self.$hitboxBeingEdited = null;
				self.events.trigger('hitboxes-edited');
			}
		});
		this.$hurtboxes.on('dblclick', '.hurtbox', function() {
			$(this).remove();
			self.events.trigger('hitboxes-edited');
		});
	}
	SpriteHitboxCanvas.prototype.loadSprite = function(imageData) {
		this.imageData = imageData;
		this.pixelWidth = CANVAS_WIDTH / this.imageData.sprite.frameWidth;
		this.pixelHeight = CANVAS_HEIGHT / this.imageData.sprite.frameHeight;
		this.clearCanvas();
	};
	SpriteHitboxCanvas.prototype.clearCanvas = function() {
		this.col = null;
		this.row = null;
		this.$hitboxBeingEdited = null;
		this.$image.css({ backgroundImage: 'none' });
		this.$hurtboxes.empty();
	};
	SpriteHitboxCanvas.prototype.showCell = function(col, row, hurtboxes) {
		if(this.col !== col || this.row !== row) {
			this.clearCanvas();
			this.col = col;
			this.row = row;
			this.$hitboxBeingEdited = null;
			this.$ele.css('backgroundSize', this.pixelWidth + 'px ' + this.pixelHeight + 'px');
			this.$image.css({
				backgroundImage: 'url(' + this.imageData.sprite.imagePath + ')',
				backgroundSize: (CANVAS_WIDTH * this.imageData.numCols) + 'px ' + (CANVAS_HEIGHT * this.imageData.numRows) + 'px',
				backgroundPosition: (-CANVAS_WIDTH * this.col) + 'px ' + (-CANVAS_HEIGHT * this.row) + 'px'
			});

			//load hurtboxes
			if(hurtboxes) {
				for(var i = 0; i < hurtboxes.length; i++) {
					$('<div></div>').addClass('hurtbox').css({
						left: hurtboxes[i].x * this.pixelWidth,
						top: hurtboxes[i].y * this.pixelHeight,
						width: hurtboxes[i].width * this.pixelWidth,
						height: hurtboxes[i].height * this.pixelHeight
					}).data({
						startX: hurtboxes[i].x,
						startY: hurtboxes[i].y,
						endX: hurtboxes[i].x + hurtboxes[i].width - 1,
						endY: hurtboxes[i].y + hurtboxes[i].height - 1
					}).appendTo(this.$hurtboxes);
				}
			}
		}
	};
	SpriteHitboxCanvas.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	SpriteHitboxCanvas.prototype.getHurtboxData = function() {
		if(this.isEditingCell()) {
			return this.$hurtboxes.find('.hurtbox').map(function(i) {
				var startX = $(this).data('startX');
				var startY = $(this).data('startY');
				var endX = $(this).data('endX');
				var endY = $(this).data('endY');
				return {
					x: Math.min(startX, endX),
					y: Math.min(startY, endY),
					width: Math.abs(endX - startX) + 1,
					height: Math.abs(endY - startY) + 1
				};
			}).get();
		}
	};
	SpriteHitboxCanvas.prototype.isEditingCell = function() {
		return this.imageData && typeof this.col === 'number' && typeof this.row === 'number';
	};
	return SpriteHitboxCanvas;
});