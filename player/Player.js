import Drawer from "../Draw.js";
import Input from "./PlayerInput.js";
import Gravity from "../Gravity.js";
import PlayerState from "./PlayerState.js";
import PlayerMovement from "./PlayerMovement.js";

export default class Player extends PlayerMovement {
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

	drawStats() {
		this.Draw.setFont("20px Arial");
		this.Draw.drawText(`HP: ${this.health}`, "black", 20, 40);
		this.Draw.drawText(`State: ${this.actionState.currentState.state}`, "black", 20, 80);
		this.Draw.drawText(`$${this.inventory.money}`, "black", 20, 120);

		// this.Draw.setFill(this.color);
		// this.Draw.setStroke(this.color);
		// this.Draw.drawRect(offset.x, offset.y, this.width, this.height, true);
	}

	update(shop) {
		this.actionState.update(this.input, shop);
		this.inventory.updateUI();
	}
}
