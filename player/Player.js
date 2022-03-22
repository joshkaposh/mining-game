import Drawer from "../Draw.js";
import Input from "./PlayerInput.js";
import Gravity from "../Gravity.js";
import PlayerState from "./PlayerState.js";
import PlayerMovement from "./PlayerMovement.js";

export default class Player extends PlayerMovement {
	// health, pos, velocity, width, height, tilesize, getTile
	constructor(context, health, pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile) {
		super(health, pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile);
		this.Draw = new Drawer(context);
		this.gravity = new Gravity(5, 3.5);
		this.input = new Input();
		this.state = {
			isMoving: false,
			isFlying: false,
			isStanding: false,
			isFalling: false,
		};
		this.actionState = new PlayerState(this);

		this.color = "blue";
	}

	draw() {
		this.Draw.setFont("20px Arial");
		this.Draw.drawText(`HP: ${this.health}`, "black", 20, 40);
		this.Draw.drawText(`State: ${this.actionState.currentState.state}`, "black", 20, 80);

		this.Draw.setFill(this.color);
		this.Draw.setStroke(this.color);

		// if (this.actionState.currentState.state === PLAYER_STATES.MINING) {
		// 	this.Draw.drawLine(centerOfBox(this.pos, this.width, this.height), this.drill.miningPoint);
		// }
		this.Draw.drawRect(this.pos.x, this.pos.y, this.width, this.height, true);
	}

	move() {
		const { keys } = this.input;

		if (keys["KeyW"]) {
			// somehow move this to keydown
			this.state.isFlying = true;
			// needs collision
			this.moveUp();
		}
		if (keys["KeyA"]) {
			this.state.isMoving = true;
			this.moveLeft();
		}
		if (keys["KeyS"]) {
			this.state.isMoving = true;
			this.moveDown();
		}
		if (keys["KeyD"]) {
			this.state.isMoving = true;
			this.moveRight();
		}
	}

	update() {
		this.actionState.update(this.input);
		this.inventory.updateUI();
	}
}
