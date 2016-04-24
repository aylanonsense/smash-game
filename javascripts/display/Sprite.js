define([
	'config',
	'display/camera'
], function(
	config,
	camera
) {
	var ctx = config.RENDER ? canvas.getContext("2d") : null;
	var images = {};

	function Sprite(params) {
		this.loaded = false;
		this.canvas = null;
		this.scale = params.scale || 1;
		this.allowFlipping = params.allowFlipping || false;
		this.frameWidth = params.frameWidth * this.scale;
		this.frameHeight = params.frameHeight * this.scale;
		this.numCols = null;
		this.numRows = null;
		this._centerX = params.center ? params.center.x : 0;
		this._centerY = params.center ? params.center.y : 0;
		this._boundingBox = params.boundingBox || null;

		//if the image isn't loaded... well, we need to load it
		var imagePath = params.path;
		if(!images[imagePath]) {
			images[imagePath] = { imageData: null, width: null, height: null, waitingOnLoad: [ this ] };
			var image = new Image();
			//when it's done loading, give the image data to everything waiting on it
			image.onload = function() {
				//copy the image onto a canvas to get image data out of it
				var canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(image, 0, 0);
				images[imagePath].imageData = ctx.getImageData(0, 0, image.width, image.height).data;
				images[imagePath].width = image.width;
				images[imagePath].height = image.height;
				//inform every Sprite that relies on this image that it is loaded
				for(var i = 0; i < images[imagePath].waitingOnLoad.length; i++) {
					images[imagePath].waitingOnLoad[i]._onImageLoaded(images[imagePath].imageData, images[imagePath].width, images[imagePath].height);
				}
				delete images[imagePath].waitingOnLoad;
			};
			image.src = imagePath;
		}
		//if it's loading, add this spritesheet to the list of things to be notified when it's loaded
		else if(!images[imagePath].imageData) {
			images[imagePath].waitingOnLoad.push(this);
		}
		//if it's done loading, great, now we can manipulate it according to the sprite
		else {
			this._onImageLoaded(images[imagePath].imageData, images[imagePath].width, images[imagePath].height);
		}

	}
	Sprite.prototype._onImageLoaded = function(imageData, imageWidth, imageHeight) {
		//create another canvas, scaled as needed
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.scale * imageWidth;
		this.canvas.height = this.scale * imageHeight * (this.allowFlipping ? 2 : 1);
		var ctx = this.canvas.getContext('2d');
		//transfer image data onto the scaled canvas
		var i = 0;
		for(var y = 0; y < imageWidth; y++) {
			for(var x = 0; x < imageHeight; x++) {
				//fill the scaled pixel
				var r = imageData[i++], g = imageData[i++], b = imageData[i++], a = imageData[i++] / 100.0;
				ctx.fillStyle = 'rgba(' + [r, g, b, a].join(',') + ')';
				ctx.fillRect(this.scale * x, this.scale * y, this.scale, this.scale);
				if(this.allowFlipping) {
					//fill the flipped pixel too
					ctx.fillRect(this.canvas.width - this.scale * (x + 1), this.canvas.height / 2 + this.scale * y, this.scale, this.scale);
				}
			}
		}
		this.numCols = this.scale * imageWidth / this.frameWidth;
		this.numRows = this.scale * imageHeight / this.frameHeight;
		this.loaded = true;
	};
	Sprite.prototype.draw = function(frame, x, y, params) {
		if(config.RENDER && this.loaded) {
			//locate the frame on the Sprite
			var frameX = frame % this.numCols;
			var frameY = Math.floor(frame / this.numCols);
			if(params && params.flip && this.allowFlipping) {
				frameX = this.numCols - frameX - 1;
				frameY += this.numRows;
			}
			var flip = params && params.flip;
			var sourceX = frameX * this.frameWidth;
			var sourceY = frameY * this.frameHeight;
			var destinationX = flip ? x - this.frameWidth + this.scale * this._centerX : x - this.scale * this._centerX;
			var destinationY = y - this.scale * this._centerY;
			var zoom, offsetX, offsetY;
			//fixed drawings will ignore the position of the camera
			if(params && params.fixed) {
				zoom = 1;
				offsetX = 0;
				offsetY = 0;
			}
			else {
				zoom = camera.zoom;
				offsetX = -camera.pos.x;
				offsetY = -camera.pos.y;
			}
			ctx.drawImage(this.canvas, sourceX, sourceY, this.frameWidth, this.frameHeight,
				zoom * destinationX + offsetX, zoom * destinationY + offsetY,
				zoom * this.frameWidth, zoom * this.frameHeight);
		}
	};
	return Sprite;
});