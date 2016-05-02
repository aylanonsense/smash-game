define([
	'json!data/config.json',
	'entity/Entity',
	'util/extend',
	'display/draw',
	'entity/hitbox/Hurtbox',
	'entity/hitbox/Hitbox',
	'data/fighterStates'
], function(
	config,
	Entity,
	extend,
	draw,
	Hurtbox,
	Hitbox,
	fighterStates
) {
	function Fighter(params) {
		Entity.call(this, extend(params, {
			width: params.frameData.width,
			height: params.frameData.height
		}));

		//state
		this.frameData = params.frameData;
		this.state = 'standing';
		this.framesInCurrentState = 0;
		this.facing = params.facing || 1;
		this.framesSinceLastJump = 0;
		this.framesSinceLastDash = 0;
		this.framesOfFreezeLeft = 0;
		this.framesOfStunLeft = 0;
		this.airborneJumpsUsed = 0;
		this.platform = null;
		this.hitboxes = [];
		this.hurtboxes = [];
		this.recentHits = [];

		//input
		this.heldHorizontalDir = 0;
		this.heldVerticalDir = 0;
		this.isHoldingBlock = false;
		//input - buffered actions
		this.bufferedAction = null;
		this.bufferedActionDir = null;
		this.bufferedActionFrames = 0;
		//input - buffered horizontal direction
		this.bufferedHorizontalDir = null;
		this.bufferedHorizontalDirFrames = 0;
		//input - buffered vertical direction
		this.bufferedVerticalDir = null;
		this.bufferedVerticalDirFrames = 0;
	}
	Fighter.prototype = Object.create(Entity.prototype);
	Fighter.prototype.startOfFrame = function() {
		if(this.framesOfFreezeLeft > 0) {
			this.framesOfFreezeLeft--;
		}
		if(this.framesOfFreezeLeft === 0) {
			this.framesInCurrentState++;
			this.framesSinceLastJump++;
			this.framesSinceLastDash++;
			this.framesOfStunLeft--;
		}

		//increment input buffer timers
		if(this.bufferedAction) {
			if(++this.bufferedActionFrames > config.FRAMES_OF_INPUT_BUFFER) {
				this.clearBufferedAction();
			}
		}
		if(this.bufferedHorizontalDir) {
			if(++this.bufferedHorizontalDirFrames > config.FRAMES_OF_INPUT_BUFFER) {
				this.clearBufferedHorizontalDir();
			}
		}
		if(this.bufferedVerticalDir) {
			if(++this.bufferedVerticalDirFrames > config.FRAMES_OF_INPUT_BUFFER) {
				this.clearBufferedVerticalDir();
			}
		}
	};
	Fighter.prototype.handleInput = function(key, isDown, state) {
		//handle changes of direction
		if(key === 'LEFT' && isDown) { this.heldHorizontalDir = -1; }
		else if(key === 'LEFT' && !isDown && this.heldHorizontalDir === -1) { this.heldHorizontalDir = 0; }
		else if(key === 'RIGHT' && isDown) { this.heldHorizontalDir = 1; }
		else if(key === 'RIGHT' && !isDown && this.heldHorizontalDir === 1) { this.heldHorizontalDir = 0; }
		else if(key === 'UP' && isDown) { this.heldVerticalDir = -1; }
		else if(key === 'UP' && !isDown && this.heldVerticalDir === -1) { this.heldVerticalDir = 0; }
		else if(key === 'DOWN' && isDown) { this.heldVerticalDir = 1; }
		else if(key === 'DOWN' && !isDown && this.heldVerticalDir === 1) { this.heldVerticalDir = 0; }

		//buffer inputs
		if((key === 'LEFT' || key === 'RIGHT') && isDown) {
			this.bufferHorizontalDir(key === 'LEFT' ? -1 : 1);
			if(this.isHoldingBlock) {
				this.bufferAction('DASH', this.heldHorizontalDir);
			}
		}
		else if((key === 'UP' || key === 'DOWN') && isDown) {
			this.bufferVerticalDir(key === 'UP' ? -1 : 1);
		}
		else if(key === 'BLOCK') {
			this.isHoldingBlock = isDown;
			if(isDown && this.heldHorizontalDir !== 0) {
				this.bufferAction('DASH', this.heldHorizontalDir);
			}
		}
		else if(key === 'JUMP' && isDown) {
			this.bufferAction('JUMP');
		}
		else if(key === 'LIGHT_ATTACK' && isDown && this.heldHorizontalDir === 0) {
			this.bufferAction('LIGHT_NEUTRAL_ATTACK');
		}
		else if(key === 'LIGHT_ATTACK' && isDown && this.heldHorizontalDir !== 0) {
			this.bufferAction('LIGHT_FORWARD_ATTACK', this.heldHorizontalDir);
		}

		//after each input, check to see if that changes the state
		if(this.framesOfFreezeLeft === 0) {
			this.checkForStateTransitions();
		}
	};
	Fighter.prototype.move = function(platforms) {
		if(this.framesOfFreezeLeft === 0) {
			//apply physics
			var m, stillVelX = (this.platform ? this.platform.vel.x : 0), stillVelY = 0;
			if(fighterStates[this.state].physics === 'standing') {
				//standing physics just involves slowly decelerating until still
				var standingDeceleration = this.getFrameDataValue('standingDeceleration');
				var standingSoftMaxSpeed = this.getFrameDataValue('standingSoftMaxSpeed');
				var standingAboveMaxSpeedDeceleration = this.getFrameDataValue('standingAboveMaxSpeedDeceleration');
				m = this.vel.x > stillVelX ? 1 : -1; //1 if moving right, -1 if moving left
				//decelerate move speed
				if(this.vel.x * m > stillVelX * m + standingSoftMaxSpeed) {
					this.vel.x -= standingAboveMaxSpeedDeceleration * m / 60;
				}
				else {
					this.vel.x -= standingDeceleration * m / 60;
				}
				//don't decelerate past the still velocity
				if(this.vel.x * m < stillVelX * m) {
					this.vel.x = stillVelX;
				}
			}
			else if(fighterStates[this.state].physics === 'running') {
				//when running we assume the player is moving continually in the direction they are facing
				var runningSoftMaxSpeed = this.getFrameDataValue('runningSoftMaxSpeed');
				var runningAcceleration = this.getFrameDataValue('runningAcceleration');
				var runningWrongWayDeceleration = this.getFrameDataValue('runningWrongWayDeceleration');
				var runningAboveMaxSpeedDeceleration = this.getFrameDataValue('runningAboveMaxSpeedDeceleration');
				m = this.facing; //1 if facing right, -1 if facing left
				//running above max speed, decelerate
				if(this.vel.x * m > stillVelX * m + runningSoftMaxSpeed) {
					this.vel.x -= runningAboveMaxSpeedDeceleration * m / 60;
					//don't decelerate past the max speed
					if(this.vel.x * m < stillVelX * m + runningSoftMaxSpeed) {
						this.vel.x = stillVelX + runningSoftMaxSpeed * m;
					}
				}
				else {
					//moving in the right direction, accelerate up to the max speed
					if(this.vel.x * m > stillVelX * m) {
						this.vel.x += runningAcceleration * m / 60;
					}
					//moving the wrong way, decelerate
					else {
						this.vel.x += runningWrongWayDeceleration * m / 60;
					}
					//don't accelerate past the max speed
					if(this.vel.x * m > stillVelX * m + runningSoftMaxSpeed) {
						this.vel.x = stillVelX + runningSoftMaxSpeed * m;
					}
				}
			}
			else if(fighterStates[this.state].physics === 'airborne') {
				//when airborne, the player can freely move back and forth
				var airborneSoftMaxSpeed = this.getFrameDataValue('airborneSoftMaxSpeed');
				var airborneAcceleration = this.getFrameDataValue('airborneAcceleration');
				var airborneDeceleration = this.getFrameDataValue('airborneDeceleration');
				var airborneTurnaroundDeceleration = this.getFrameDataValue('airborneTurnaroundDeceleration');
				var airborneAboveMaxSpeedDeceleration = this.getFrameDataValue('airborneAboveMaxSpeedDeceleration');
				m = this.vel.x > stillVelX ? 1 : -1; //1 if moving right, -1 if moving left
				if(this.vel.x === stillVelX) { m = this.heldHorizontalDir; }
				//not trying to move
				if(this.heldHorizontalDir === 0) {
					//decelerate from above max speed
					if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
						this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
					}
					//decelerate normally
					else {
						this.vel.x -= airborneDeceleration * m / 60;
					}
					//don't decelerate past zero
					if(this.vel.x * m < stillVelX * m) {
						this.vel.x = stillVelX;
					}
				}
				//trying to move in the direction of movement
				else if(this.heldHorizontalDir === m) {
					//decelerate down to max speed
					if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
						this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
						if(this.vel.x * m < stillVelX * m + airborneSoftMaxSpeed) {
							this.vel.x = stillVelX + airborneSoftMaxSpeed * m;
						}
					}
					//accelerate up to max speed
					else {
						this.vel.x += airborneAcceleration * m / 60;
						if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
							this.vel.x = stillVelX + airborneSoftMaxSpeed * m;
						}
					}
				}
				//m === 1 (moving right), horizontalDir === -1 (trying to move left)
				//trying to move opposite the direction of movement
				else {
					//decelerate if moving above max speed the ~other~ way
					if(this.vel.x * m > stillVelX * m + airborneSoftMaxSpeed) {
						this.vel.x -= airborneAboveMaxSpeedDeceleration * m / 60;
					}
					//decelerate normally
					else {
						this.vel.x -= airborneTurnaroundDeceleration * m / 60;
					}
					//don't let this make us accelerate above max speed
					if(this.vel.x * m < stillVelX * m - airborneSoftMaxSpeed) {
						this.vel.x = stillVelX - airborneSoftMaxSpeed * m;
					}
				}
			}

			//always apply gravity, even while grounded
			var gravity = this.getFrameDataValue('gravity');
			var softMaxFallSpeed = this.getFrameDataValue('softMaxFallSpeed');
			var aboveMaxFallSpeedDeceleration = this.getFrameDataValue('aboveMaxFallSpeedDeceleration');
			if(this.vel.y < stillVelX + softMaxFallSpeed) {
				this.vel.y += gravity / 60;
				if(this.vel.y > stillVelY + softMaxFallSpeed) {
					this.vel.y = stillVelY + softMaxFallSpeed;
				}
			}
			//if falling too fast, slow down
			else {
				this.vel.y -= aboveMaxFallSpeedDeceleration / 60;
				if(this.vel.y < stillVelY + softMaxFallSpeed) {
					this.vel.y = stillVelY + softMaxFallSpeed;
				}
			}

			//ensure the velocity doens't get too crazy, keep it bounded
			var absoluteMaxHorizontalSpeed = this.getFrameDataValue('absoluteMaxHorizontalSpeed');
			var absoluteMaxVerticalSpeed = this.getFrameDataValue('absoluteMaxVerticalSpeed');
			if(this.vel.x > absoluteMaxHorizontalSpeed) { this.vel.x = absoluteMaxHorizontalSpeed; }
			else if(this.vel.x < -absoluteMaxHorizontalSpeed) { this.vel.x = -absoluteMaxHorizontalSpeed; }
			if(this.vel.y > absoluteMaxVerticalSpeed) { this.vel.y = absoluteMaxVerticalSpeed; }
			else if(this.vel.y < -absoluteMaxVerticalSpeed) { this.vel.y = -absoluteMaxVerticalSpeed; }
		}

		//update position
		var collisions = [];
		var moveSteps = Math.max(1, Math.ceil(Math.max(Math.abs(this.vel.x / 60), Math.abs(this.vel.y / 60)) / config.MAX_MOVEMENT_PER_STEP));
		for(var i = 0; i < moveSteps; i++) {
			//move in steps to avoid clipping through a platform
			this.pos.x += this.framesOfFreezeLeft > 0 ? 0 : (this.vel.x / 60) / moveSteps;
			this.pos.y += this.framesOfFreezeLeft > 0 ? 0 : (this.vel.y / 60) / moveSteps;
			//check for collisions
			for(var j = 0; j < platforms.length; j++) {
				if(this.collisionBoxes.left.isOverlapping(platforms[j])) {
					if(this.vel.x < 0) { this.vel.x = 0; }
					this.left = platforms[j].right;
					collisions.push({ platform: platforms[j], dir: 'left' });
				}
				if(this.collisionBoxes.right.isOverlapping(platforms[j])) {
					if(this.vel.x > 0) { this.vel.x = 0; }
					this.right = platforms[j].left;
					collisions.push({ platform: platforms[j], dir: 'right' });
				}
				if(this.collisionBoxes.bottom.isOverlapping(platforms[j])) {
					if(this.vel.y > 0) { this.vel.y = 0; }
					this.bottom = platforms[j].top;
					collisions.push({ platform: platforms[j], dir: 'bottom' });
				}
				if(this.collisionBoxes.top.isOverlapping(platforms[j])) {
					if(this.vel.y < 0) { this.vel.y = 0; }
					this.top = platforms[j].bottom;
					collisions.push({ platform: platforms[j], dir: 'top' });
				}
			}
		}

		//handle all collisions that happened during movement
		this.platform = null;
		for(i = 0; i < collisions.length; i++) {
			this.handleCollision(collisions[i].platform, collisions[i].dir);
		}

		//check for state transitions
		if(this.framesOfFreezeLeft === 0) {
			this.checkForStateTransitions();
		}

		//update hitboxes
		this.recalculateHitBoxes();
	};
	Fighter.prototype.checkForHit = function(fighter) {
		var i, j, k;

		//check to see if any hitboxes are hitting the other fighter's hurtboxes
		for(i = 0; i < this.hitboxes.length; i++) {
			for(j = 0; j < fighter.hurtboxes.length; j++) {
				if(this.hitboxes[i].isOverlapping(fighter.hurtboxes[j])) {
					//do not allow a hitbox or hitbox group to hit someone twice
					var hasAlreadyBeenHit = false;
					for(k = 0; k < this.recentHits.length; k++) {
						if(this.recentHits[k].defender.sameAs(fighter) && this.recentHits[k].hitbox.group === this.hitboxes[i].group) {
							hasAlreadyBeenHit = true;
						}
					}
					if(!hasAlreadyBeenHit) {
						return {
							attacker: this,
							defender: fighter,
							hitbox: this.hitboxes[i],
							clank: false
						};
					}
				}
			}
		}

		/*
		//if there is no hit, check to see if any hitboxes are hitting the other fighters' hitboxes
		for(i = 0; i < this.hitboxes.length; i++) {
			for(j = 0; k < fighter.hitboxes.length; j++) {
				if(this.hitboxes[i].isOverlapping(fighter.hitboxes[j])) {
					return {
						attacker: this,
						defender: fighter,
						hitbox: this.hitboxes[i],
						clank: true
					};
				}
			}
		}
		*/
	};
	Fighter.prototype.handleHitting = function(hit) {
		this.recentHits.push(hit);
		this.framesOfFreezeLeft = hit.hitbox.freeze;
	};
	Fighter.prototype.handleBeingHit = function(hit) {
		this.vel.x = hit.hitbox.knockback * Math.sin(hit.hitbox.angle * Math.PI / 180);
		this.vel.y = hit.hitbox.knockback * Math.cos(hit.hitbox.angle * Math.PI / 180);
		this.framesOfFreezeLeft = hit.hitbox.freeze;
		this.framesOfStunLeft = hit.hitbox.stun;
		this.checkForStateTransitions();
		this.recalculateHitBoxes();
	};
	Fighter.prototype.endOfFrame = function() {};
	Fighter.prototype.render = function() {
		//draw sprite
		var spriteKey = this.getFrameDataValue('spriteKey');
		var frame = this.getFrameDataValue('spriteFrame');
		var jiggle = 0;
		if(this.framesOfStunLeft > 0 && this.framesOfFreezeLeft > 0) {
			jiggle = 0.25 * this.framesOfFreezeLeft * ((this.framesOfFreezeLeft % 3) - 1);
		}
		draw.sprite(spriteKey, frame, this.pos.x, this.pos.y + jiggle, { flip: this.facing < 0 });
		if(fighterStates[this.state].isBlocking) {
			draw.sprite('shield', 2, this.pos.x, this.pos.y);
		}

		//draw hurtboxes
		if(config.SHOW_HITBOXES) {
			for(var i = 0; i < this.hurtboxes.length; i++) {
				this.hurtboxes[i].render();
			}
			for(i = 0; i < this.hitboxes.length; i++) {
				this.hitboxes[i].render();
			}
		}

		//draw collision boxes
		if(config.SHOW_COLLISION_BOXES) {
			draw.poly(this.collisionBoxes.left.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.left.top,  this.collisionBoxes.top.left, this.collisionBoxes.top.top,
				this.collisionBoxes.top.right, this.collisionBoxes.top.top,  this.collisionBoxes.top.right, this.collisionBoxes.right.top,  this.collisionBoxes.right.right, this.collisionBoxes.right.top,
				this.collisionBoxes.right.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.right.bottom,  this.collisionBoxes.bottom.right, this.collisionBoxes.bottom.bottom,
				this.collisionBoxes.bottom.left, this.collisionBoxes.bottom.bottom,  this.collisionBoxes.bottom.left, this.collisionBoxes.left.bottom,  this.collisionBoxes.left.left, this.collisionBoxes.left.bottom,
				{ close: true, stroke: '#fff', thickness: 1 });
		}

		//draw info below the sprite
		if(config.SHOW_FIGHTER_DEBUG_DATA) {
			draw.text(this.state, this.pos.x, this.pos.y + 15, { fontSize: 14, color: '#fff', align: 'center' });
			draw.text('(frame ' + (this.framesInCurrentState + 1) + ')', this.pos.x, this.pos.y + 27, { fontSize: 10, color: '#aaa', align: 'center' });
		}
	};

	//helper methods
	Fighter.prototype.handleCollision = function(platform, dir) {
		if(dir === 'bottom') {
			this.platform = platform;
			this.airborneJumpsUsed = 0;
		}
	};
	Fighter.prototype.checkForStateTransitions = function() {
		var stateHasChanged = this.checkForStateTransition();
		for(var numTransitions = 0; numTransitions < 10 && stateHasChanged; numTransitions++) {
			stateHasChanged = this.checkForStateTransition();
		}
	};
	Fighter.prototype.checkForStateTransition = function() {
		//figure out if the animation has looped
		var animationHasLooped = (this.framesInCurrentState >= this.frameData.states[this.state].totalFrames);

		//then iterate through all possible transitions and see if one is valid
		var frameCancels = this.getFrameDataValue('frameCancels');
		for(var i = 0; i < fighterStates[this.state].transitions.length; i++) {
			var transition = fighterStates[this.state].transitions[i];
			//check to make sure the transition can be canceled into
			if(transition.cancel || (!transition.frameCancel && animationHasLooped) ||
				(transition.frameCancel && frameCancels && frameCancels.indexOf(transition.state) >= 0)) {
				//check to see if the transition's conditions are satisfied
				if(!fighterStates[transition.state].conditions || fighterStates[transition.state].conditions.call(this)) {
					//we can transition to the new state!
					this.setState(transition.state);
					return true;
				}
			}
		}
		return false;
	};
	Fighter.prototype.setState = function(state, frame) {
		//apply effects from leaving the old state
		if(fighterStates[this.state].effectsOnLeave) {
			fighterStates[this.state].effectsOnLeave.call(this, state);
		}
		//switch to the new state
		var prevState = this.state;
		var prevFrames = this.framesInCurrentState;
		this.state = state;
		this.framesInCurrentState = frame || 0;
		this.recentHits = [];
		//apply effects from entering the new state
		if(fighterStates[this.state].effectsOnEnter) {
			fighterStates[this.state].effectsOnEnter.call(this, prevState, prevFrames);
		}
	};
	Fighter.prototype.recalculateHitBoxes = function() {
		var i;

		//create rects out of hitbox data
		this.hitboxes = [];
		var hitboxes = this.getFrameDataValue('hitboxes');
		if(hitboxes) {
			for(i = 0; i < hitboxes.length; i++) {
				var hitboxParams = {};
				for(var key in hitboxes[i]) {
					hitboxParams[key] = hitboxes[i][key];
				}
				hitboxParams.parent = this;
				hitboxParams.x = this.facing > 0 ? hitboxes[i].x : -hitboxes[i].x - hitboxes[i].width;
				hitboxParams.angle = this.facing * hitboxes[i].angle;
				this.hitboxes.push(new Hitbox(hitboxParams));
			}
		}

		//create rects out of hurtbox data
		this.hurtboxes = [];
		var hurtboxes = this.getFrameDataValue('hurtboxes');
		if(hurtboxes) {
			for(i = 0; i < hurtboxes.length; i++) {
				this.hurtboxes.push(new Hurtbox({
					parent: this,
					x: this.facing > 0 ? hurtboxes[i].x : -hurtboxes[i].x - hurtboxes[i].width,
					y: hurtboxes[i].y,
					width: hurtboxes[i].width,
					height: hurtboxes[i].height
				}));
			}
		}
	};
	Fighter.prototype.getFrameDataValue = function(key) {
		var animation = this.getCurrentAnimationFrame();
		if(typeof animation[key] !== 'undefined') {
			return animation[key];
		}
		else if(typeof this.frameData.states[this.state][key] !== 'undefined') {
			return this.frameData.states[this.state][key];
		}
		else {
			return this.frameData[key];
		}
	};
	Fighter.prototype.getCurrentAnimationFrame = function() {
		var frames = this.framesInCurrentState % this.frameData.states[this.state].totalFrames;
		for(i = 0; i < this.frameData.states[this.state].animation.length; i++) {
			frames -= this.frameData.states[this.state].animation[i].frames;
			if(frames < 0) {
				return this.frameData.states[this.state].animation[i];
			}
		}
	};
	Fighter.prototype.bufferAction = function(action, dir) {
		this.bufferedAction = action;
		this.bufferedActionDir = (arguments.length > 1 ? dir : null);
		this.bufferedActionFrames = 0;
	};
	Fighter.prototype.hasBufferedAction = function(action, dir) {
		if(arguments.length === 0) {
			return this.bufferedAction !== null;
		}
		else if(arguments.length === 1) {
			return this.bufferedAction === action;
		}
		else {
			return this.bufferedAction === action && this.bufferedActionDir === dir;
		}
	};
	Fighter.prototype.clearBufferedAction = function() {
		this.bufferedAction = null;
		this.bufferedActionDir = null;
		this.bufferedActionFrames = 0;
	};
	Fighter.prototype.bufferHorizontalDir = function(dir) {
		this.bufferedHorizontalDir = dir;
		this.bufferedHorizontalDirFrames = 0;
	};
	Fighter.prototype.hasBufferedHorizontalDir = function(dir) {
		if(arguments.length === 0) {
			return this.bufferedHorizontalDir !== null;
		}
		else {
			return this.bufferedHorizontalDir === dir;
		}
	};
	Fighter.prototype.clearBufferedHorizontalDir = function() {
		this.bufferedHorizontalDir = null;
		this.bufferedHorizontalDirFrames = 0;
	};
	Fighter.prototype.bufferVerticalDir = function(dir) {
		this.bufferedVerticalDir = dir;
		this.bufferedVerticalDirFrames = 0;
	};
	Fighter.prototype.hasBufferedVerticalDir = function(dir) {
		if(arguments.length === 0) {
			return this.bufferedVerticalDir !== null;
		}
		else {
			return this.bufferedVerticalDir === dir;
		}
	};
	Fighter.prototype.clearBufferedVerticalDir = function() {
		this.bufferedVerticalDir = null;
		this.bufferedVerticalDirFrames = 0;
	};
	Fighter.prototype.isAirborne = function() {
		return !this.platform;
	};
	return Fighter;
});