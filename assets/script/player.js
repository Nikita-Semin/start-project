// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		// main character's jump height
		jumpHeight: 0,
		// main character's jump duration
		jumpDuration: 0,
		// maximal movement speed
		maxMoveSpeed: 0,
		// acceleration
		accel: 0,
	},

	setJumpAction: function () {
		// jump up
		let jumpUp = cc
			.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight))
			.easing(cc.easeCubicActionOut());

		// jump down
		let jumpDown = cc
			.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight))
			.easing(cc.easeCubicActionIn());

		// repeat
		return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
	},

	setInputControl: function () {
		let self = this;
		// add keyboard event listener
		// When there is a key being pressed down, judge if it's the designated directional button and set up acceleration in the corresponding direction
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
			switch (event.keyCode) {
				case cc.KEY.a:
					self.accLeft = true;
					break;
				case cc.KEY.d:
					self.accRight = true;
					break;
			}
		});

		// when releasing the button, stop acceleration in this direction
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
			switch (event.keyCode) {
				case cc.KEY.a:
					self.accLeft = false;
					break;
				case cc.KEY.d:
					self.accRight = false;
					break;
			}
		});
	},

	onLoad: function () {
		// initialize jump action
		this.jumpAction = this.setJumpAction();
		this.node.runAction(this.jumpAction);

		// switch of acceleration direction
		this.accLeft = false;
		this.accRight = false;
		// current horizontal speed of main character
		this.xSpeed = 0;

		// initialize keyboard input listener
		this.setInputControl();
	},

	update: function (dt) {
		// update speed of each frame according to the current acceleration direction
		if (this.accLeft) {
			this.xSpeed -= this.accel * dt;
		} else if (this.accRight) {
			this.xSpeed += this.accel * dt;
		}
		// restrict the movement speed of the main character to the maximum movement speed
		if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
			// if speed reaches its limit, use the max speed with current direction
			this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
		}

		// update the position of the main character according to the current speed
		this.node.x += this.xSpeed * dt;
	},

	start() {},
});
