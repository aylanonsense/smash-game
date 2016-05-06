define([
	'jquery',
	'util/EventHelper'
], function(
	$,
	EventHelper
) {
	function SpriteCellChooser(params) {
		var self = this;
		this.events = new EventHelper([ 'cell-selected' ]);

		//variables
		this.imageData = null;
		this.col = null;
		this.row = null;

		//find elements
		this.$ele = params.$ele;

		//bind events
		this.$ele.on('click', '.sprite-cell', function() {
			self.$ele.find('.sprite-cell').removeClass('selected');
			$(this).addClass('selected');
			self.col = $(this).data('col');
			self.row = $(this).data('row');
			self.events.trigger('cell-selected', self.col, self.row);
		});
	}
	SpriteCellChooser.prototype.loadSprite = function(imageData) {
		this.imageData = imageData;

		//load the image into the cell chooser
		this.$ele.css({
			width: this.imageData.numCols * (30 + 1),
			height: this.imageData.numRows * (30 + 1) + 1
		}).empty();
		for(var row = 0; row < this.imageData.numRows; row++) {
			for(var col = 0; col < this.imageData.numCols; col++) {
				$('<div></div>').addClass('sprite-cell').css({
					width: 30,
					height: 30,
					backgroundImage: 'url(' + this.imageData.sprite.imagePath + ')',
					backgroundSize: (30 * this.imageData.numCols) + 'px ' + (30 * this.imageData.numRows) + 'px',
					backgroundPosition: (-30 * col) + 'px ' + (-30 * row) + 'px'
				}).data('row', row).data('col', col).appendTo(this.$ele);
			}
		}
	};
	SpriteCellChooser.prototype.getSelectedCell = function() {
		if(this.imageData && typeof this.col === 'number' && typeof this.row === 'number') {
			return {
				col: this.col,
				row: this.row,
				frame: this.row * this.imageData.numCols + this.col
			};
		}
		return null;
	};
	SpriteCellChooser.prototype.selectCell = function(col, row) {
		this.col = col;
		this.row = row;
		var frame = this.row * this.imageData.numCols + this.col;
		this.$ele.find('.sprite-cell').removeClass('selected');
		this.$ele.find('.sprite-cell').eq(frame).addClass('selected');
	};
	SpriteCellChooser.prototype.on = function(eventName, callback, ctx) {
		return this.events.on.apply(this.events, arguments);
	};
	return SpriteCellChooser;
});