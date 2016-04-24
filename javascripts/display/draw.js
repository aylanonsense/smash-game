define([
	'config',
	'display/canvas',
	'display/camera',
	'display/Sprite'
], function(
	config,
	canvas,
	camera,
	Sprite
) {
	var DEFAULT_COLOR = '#fff';
	var DEFAULT_THICKNESS = 1;

	var ctx = config.RENDER ? canvas.getContext("2d") : null;
	var sprites = {};

	function applyDrawParams(params, defaultDrawMode) {
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

		var result = {
			shouldFill: false,
			shouldStroke: false,
			offset: { x: offsetX, y: offsetY },
			zoom: zoom
		};

		//figure out if we should stroke or fill
		if(!params || (!params.fill && !params.stroke && !params.color)) {
			if(defaultDrawMode === 'stroke') {
				result.shouldStroke = true;
				ctx.strokeStyle = DEFAULT_COLOR;
				ctx.lineWidth = zoom * (params && (params.thickness || params.thickness === 0) ? params.thickness : DEFAULT_THICKNESS);
			}
			else if(defaultDrawMode === 'fill') {
				result.shouldFill = true;
				ctx.fillStyle = DEFAULT_COLOR;
			}
		}
		else if(!params.fill && !params.stroke && params.color) {
			if(defaultDrawMode === 'stroke') {
				result.shouldStroke = true;
				ctx.strokeStyle = params.color;
				ctx.lineWidth = zoom * ((params.thickness || params.thickness === 0) ? params.thickness : DEFAULT_THICKNESS);
			}
			else if(defaultDrawMode === 'fill') {
				result.shouldFill = true;
				ctx.fillStyle = params.color;
			}
		}
		else {
			if(params.stroke) {
				result.shouldStroke = true;
				ctx.strokeStyle = params.stroke;
				ctx.lineWidth = zoom * ((params.thickness || params.thickness === 0) ? params.thickness : DEFAULT_THICKNESS);
			}
			if(params.fill) {
				result.shouldFill = true;
				ctx.fillStyle = params.fill;
			}
		}

		//return the results
		return result;
	}

	return {
		rect: function(x, y, width, height, params) {
			if(config.RENDER) {
				var result = applyDrawParams(params, 'fill');
				if(result.shouldFill) {
					ctx.fillRect(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y,
						result.zoom * width, result.zoom * height);
				}
				if(result.shouldStroke) {
					ctx.strokeRect(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y,
						result.zoom * width, result.zoom * height);
				}
			}
		},
		circle: function(x, y, r, params) {
			if(config.RENDER) {
				var result = applyDrawParams(params, 'fill');
				ctx.beginPath();
				ctx.arc(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y, result.zoom * r, 0, 2 * Math.PI);
				if(result.shouldFill) {
					ctx.fill();
				}
				if(result.shouldStroke) {
					ctx.stroke();
				}
			}
		},
		line: function(x1, y1, x2, y2, params) {
			if(config.RENDER) {
				//(Vector, Vector) or (Vector, Vector, params)
				if(arguments.length < 4) {
					params = x2; y2 = y1.y; x2 = y1.x; y1 = x1.y; x1 = x1.x;
				}
				var result = applyDrawParams(params, 'stroke');
				if(result.shouldStroke) {
					ctx.beginPath();
					ctx.moveTo(result.zoom * x1 + result.offset.x, result.zoom * y1 + result.offset.y);
					ctx.lineTo(result.zoom * x2 + result.offset.x, result.zoom * y2 + result.offset.y);
					ctx.stroke();
				}
			}
		},
		poly: function(/* x1, y1, x2, y2, ..., */ params) {
			if(config.RENDER) {
				params = arguments.length % 2 === 0 ? {} : arguments[arguments.length - 1];
				var result = applyDrawParams(params, 'stroke');
				ctx.beginPath();
				ctx.moveTo(result.zoom * arguments[0] + result.offset.x, result.zoom * arguments[1] + result.offset.y);
				for(var i = 2; i < arguments.length - 1; i += 2) {
					ctx.lineTo(result.zoom * arguments[i] + result.offset.x, result.zoom * arguments[i + 1] + result.offset.y);
				}
				if(params && params.close) {
					ctx.closePath();
				}
				if(result.shouldFill) {
					ctx.fill();
				}
				if(result.shouldStroke) {
					ctx.stroke();
				}
			}
		},
		sprite: function(spriteKey, frame, x, y, params) {
			if(config.RENDER) {
				if(!sprites[spriteKey]) {
					sprites[spriteKey] = new Sprite(config.SPRITES[spriteKey]);
				}
				if(sprites[spriteKey].loaded) {
					sprites[spriteKey].draw(frame, x, y, params);
				}
				else {
					var sprite = config.SPRITES[spriteKey];
					var result = applyDrawParams({
						fixed: params && params.fixed,
						stroke: sprite.color || DEFAULT_COLOR,
						fill: sprite.color || DEFAULT_COLOR,
						thickness: 2
					});
					var scale = sprite.scale || 1;
					var flip = params && params.flip;
					var centerX = (sprite.center ? sprite.center.x : 0);
					var centerY = (sprite.center ? sprite.center.y : 0);
					var outerLeft = (flip ? centerX - sprite.frameWidth : -centerX);
					var outerTop = -centerY;
					//draw outer sprite box
					ctx.strokeRect(result.zoom * (x + scale * outerLeft) + result.offset.x,
						result.zoom * (y + scale * outerTop) + result.offset.y,
						result.zoom * scale * sprite.frameWidth, result.zoom * scale * sprite.frameHeight);
					//draw sprite center
					if(sprite.center) {
						ctx.beginPath();
						ctx.moveTo(result.zoom * (x - 4) + result.offset.x, result.zoom * y + result.offset.y);
						ctx.lineTo(result.zoom * (x + 4) + result.offset.x, result.zoom * y + result.offset.y);
						ctx.moveTo(result.zoom * x + result.offset.x, result.zoom * (y - 4) + result.offset.y);
						ctx.lineTo(result.zoom * x + result.offset.x, result.zoom * (y + 4) + result.offset.y);
						ctx.stroke();
					}
					//draw inner bounding box
					if(sprite.boundingBox) {
						var innerLeft = centerX - sprite.boundingBox.x;
						if(flip) {
							innerLeft = sprite.boundingBox.width - innerLeft;
						}
						var innerTop = centerY - sprite.boundingBox.y;
						ctx.strokeRect(result.zoom * (x - scale * innerLeft) + result.offset.x, result.zoom * (y - scale * innerTop) + result.offset.y, result.zoom * sprite.boundingBox.width * scale, result.zoom * sprite.boundingBox.height * scale);
					}
				}
			}
		}
	};
});