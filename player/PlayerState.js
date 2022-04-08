import { CORNERS } from "./PlayerCollision.js";
import { MINE_DIRECTIONS } from "./PlayerDrill.js";
import { boxCollision } from "../physics.js";
import { facingDirections } from "./PlayerMovement.js";

export const PLAYER_STATES = {
	STANDING: 0,
	MINING: 1,
	FALLING: 2,
	FLYING: 3,
	SHOPPING: 4,
};

export const playerStates = {
	IDLE_RIGHT: 0,
	IDLE_LEFT: 1,
	MOVING_RIGHT: 2,
	MOVING_LEFT: 3,
};

class State {
	constructor(state) {
		this.state = state;
	}
}

// every state can use movement;
class Movements extends State {
	constructor(player, state) {
		super(state);
		this.player = player;
	}
	move(keys, shop) {
		if (keys["KeyA"]) this.player.moveLeft(shop);
		if (keys["KeyS"]) this.player.moveDown(shop);
		if (keys["KeyD"]) this.player.moveRight(shop);
	}
}

class IdleRight extends Movements {
	constructor(player) {
		super(player, playerStates.IDLE_RIGHT);
	}

	enter() {
		console.log("entering IDLE RIGHT state");
	}

	handleInput({ keys }) {
		// if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		if (keys["KeyD"]) this.player.actionState.changeState(playerStates.MOVING_RIGHT);
		if (keys["KeyA"]) this.player.actionState.changeState(playerStates.MOVING_LEFT);

		// if ((keys["Space"] && keys["KeyA"]) || (keys["Space"] && keys["KeyD"]) || (keys["Space"] && keys["KeyS"])) {
		// 	this.player.actionState.changeState(PLAYER_STATES.MINING);
		// }
		// this.move(keys);
	}

	update(shop) {
		let new_pos = new Vect2(this.player.pos.x, this.player.pos.y + this.player.gravity.velocity);
		let c1 = this.player.collision.calculateCorners(new_pos);
		const bottomCorners = [c1[CORNERS.BOTTOM_LEFT], c1[CORNERS.BOTTOM_RIGHT]];

		// detect if new position collides with shop(update is called after handleInput)
		if (shop.collideWithPlayer(this.player)) {
			this.player.actionState.changeState(PLAYER_STATES.SHOPPING);
		}

		// player isnt grounded, switch to FallingState
		if (!this.player.collision.collideDown(bottomCorners)) {
			this.player.actionState.changeState(PLAYER_STATES.FALLING);
		}

		this.player.gravity.reset();
	}
}

class IdleLeft extends Movements {
	constructor(player) {
		super(player, playerStates.IDLE_LEFT);
	}

	enter() {
		console.log("entering IDLE LEFT state");
	}
}

class MovingRight extends Movements {
	constructor(player) {
		super(player, playerStates.MOVING_RIGHT);
	}

	enter() {
		console.log("entering MOVING RIGHT state");
	}

	handleInput({ keys }) {
		// if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		if (keys[!"KeyD"]) this.player.actionState.changeState(playerStates.IDLE_RIGHT);
		if (keys["KeyA"]) this.player.actionState.changeState(playerStates.MOVING_LEFT);
	}
}

class MovingLeft extends Movements {
	constructor(player) {
		super(player, playerStates.MOVING_LEFT);
	}

	enter() {
		console.log("entering MOVING LEFT state");
	}

	handleInput({ keys }) {
		// if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		if (keys["KeyD"]) this.player.actionState.changeState(playerStates.IDLE_RIGHT);
		if (keys[!"KeyA"]) this.player.actionState.changeState(playerStates.MOVING_LEFT);
	}
}

class StandingState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.STANDING);
	}

	enter() {
		console.log("entering standing state");
		let frameY = this.player.facingDirection === facingDirections.LEFT ? 0 : 1;
		this.player.sprite.frameY = frameY;
		//
	}

	handleInput({ keys }) {
		if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		if ((keys["Space"] && keys["KeyA"]) || (keys["Space"] && keys["KeyD"]) || (keys["Space"] && keys["KeyS"])) {
			this.player.actionState.changeState(PLAYER_STATES.MINING);
		}
		this.move(keys);
	}

	update(shop) {
		let new_pos = new Vect2(this.player.pos.x, this.player.pos.y + this.player.gravity.velocity);
		let c1 = this.player.collision.calculateCorners(new_pos);
		const bottomCorners = [c1[CORNERS.BOTTOM_LEFT], c1[CORNERS.BOTTOM_RIGHT]];

		// detect if new position collides with shop(update is called after handleInput)
		if (shop.collideWithPlayer(this.player)) {
			this.player.actionState.changeState(PLAYER_STATES.SHOPPING);
		}

		// player isnt grounded, switch to FallingState
		if (!this.player.collision.collideDown(bottomCorners)) {
			this.player.actionState.changeState(PLAYER_STATES.FALLING);
		}

		this.player.gravity.reset();
	}
}

class MiningState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.MINING);
	}

	enter() {
		console.log("entering mining state");
	}

	handleInput({ keys }, shop) {
		if (!keys["Space"]) this.player.actionState.changeState(PLAYER_STATES.STANDING);

		const drill = this.player.drill;

		if (keys["Space"] && keys["KeyA"]) {
			if (drill.canMineTile(this.player.pos, MINE_DIRECTIONS.LEFT)) {
				drill.setMiningPointLeft(this.player.pos);
				drill.mineLeft();
			}
		}

		if (keys["Space"] && keys["KeyD"]) {
			if (drill.canMineTile(this.player.pos, MINE_DIRECTIONS.RIGHT)) {
				drill.setMiningPointRight(this.player.pos);
				drill.mineRight();
			}
		}

		if (keys["Space"] && keys["KeyS"]) {
			if (drill.canMineTile(this.player.pos, MINE_DIRECTIONS.DOWN)) {
				drill.setMiningPointDown(this.player.pos);
				drill.mineDown();
			}
		}
		this.move(keys);
	}

	// update() {}
}

class FallingState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.FALLING);
	}

	enter() {
		console.log("entering falling state");
	}

	handleInput({ keys }) {
		if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		this.move(keys);
	}

	update() {
		//! doesnt work properly;
		let new_pos = this.player.gravity.calculateNewPosition(this.player.pos);
		let c1 = this.player.collision.calculateCorners(new_pos);
		const corners = [c1[CORNERS.BOTTOM_LEFT], c1[CORNERS.BOTTOM_RIGHT]];

		if (this.player.collision.collideWorldDown(corners) || this.player.collision.collideDown(corners)) {
			// collided with world || tile
			// if gravity velocity is greater than threshold, take fall damage
			if (this.player.gravity.velocity >= 100) {
				this.player.fallDamage();
			}

			this.player.actionState.changeState(PLAYER_STATES.STANDING);
			return;
		}
		this.player.gravity.inc();
		this.player.pos.setY(new_pos);
		// console.log(this.player.gravity.velocity);
	}
}

class FlyingState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.FLYING);
	}

	enter() {
		console.log("entering flying state");
	}

	handleInput({ keys }) {
		if (!keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.STANDING);

		if (keys["KeyW"]) this.player.moveUp();
		this.move(keys);
	}

	update() {
		this.player.gravity.reset();
	}
}

class ShoppingState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.SHOPPING);
		this.shopTag = document.getElementById("inventory");
	}

	enter() {
		console.log("entering shopping state");
		this.shopTag.style.display = "block";
	}

	exit() {
		console.log("exitting shopping state");
		this.shopTag.style.display = "none";
	}

	handleInput({ keys }, shop) {
		this.move(keys, shop);
	}

	update(shop) {
		if (!shop.collideWithPlayer(this.player)) {
			this.player.actionState.changeState(PLAYER_STATES.STANDING);
		}

		this.player.gravity.reset();
	}
}

export default class PlayerState {
	constructor(player) {
		// this.states = [
		// 	new StandingState(player),
		// 	new MiningState(player),
		// 	new FallingState(player),
		// 	new FlyingState(player),
		// 	new ShoppingState(player),
		// ];
		this.states = [new IdleRight(player), new IdleLeft(player), new MovingRight(player), new MovingLeft(player)];
		this.currentState = this.states[PLAYER_STATES.STANDING];
	}

	changeState(newState) {
		if (!this.states[newState]) return;
		this.currentState.exit?.call(this.currentState);
		this.currentState = this.states[newState];
		this.currentState.enter();
	}

	update(input, shop) {
		this.currentState.handleInput(input, shop);
		this.currentState.update?.call(this.currentState, shop);
	}
}
