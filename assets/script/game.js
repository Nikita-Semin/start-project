// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		// this property quotes the PreFab resource of stars
		starPrefab: {
			default: null,
			type: cc.Prefab,
		},
		// the random scale of disappearing time for stars
		maxStarDuration: 0,
		minStarDuration: 0,
		// ground node for confirming the height of the generated star's position
		ground: {
			default: null,
			type: cc.Node,
		},
		// player node for obtaining the jump height of the main character and controlling the movement switch of the main character
		player: {
			default: null,
			type: cc.Node,
		},

		scoreDisplay: {
			default: null,
			type: cc.Label,
		},
	},

	start() {},

	onLoad: function () {
		// obtain the anchor point of ground level on the y axis
		this.groundY = this.ground.y + this.ground.height / 2; // this.ground.top may also work
		// initialize timer
		this.timer = 0;
		this.starDuration = 0;
		// generate a new star
		this.spawnNewStar();

		// initialize scoring
		this.score = 0;
	},

	spawnNewStar: function () {
		// generate a new node in the scene with a preset template
		var newStar = cc.instantiate(this.starPrefab);
		// put the newly added node under the Canvas node
		this.node.addChild(newStar);
		// set up a random position for the star
		newStar.setPosition(this.getNewStarPosition());

		// reset timer, randomly choose a value according the scale of star duration
		this.starDuration =
			this.minStarDuration +
			cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
		this.timer = 0;
	},

	getNewStarPosition: function () {
		var randX = 0;
		// According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
		var randY =
			this.groundY +
			cc.random0To1() * this.player.getComponent('Player').jumpHeight +
			50;
		// according to the width of the screen, randomly obtain an anchor point of star on the x axis
		var maxX = this.node.width / 2;
		randX = cc.randomMinus1To1() * maxX;
		// return to the anchor point of the star
		return cc.p(randX, randY);
	},

	gainScore: function () {
		this.score += 1;
		// update the words of the scoreDisplay Label
		this.scoreDisplay.string = 'Score: ' + this.score.toString();
	},

	update: function (dt) {
		// update timer for each frame, when a new star is not generated after exceeding duration
		// invoke the logic of game failure
		if (this.timer > this.starDuration) {
			this.gameOver();
			return;
		}
		this.timer += dt;
	},

	gameOver: function () {
		this.player.stopAllActions(); // stop the jumping action of the player node
		cc.director.loadScene('game');
	},
});
