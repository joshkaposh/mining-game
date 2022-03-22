import { CORNERS } from "./PlayerCollision.js";
import { MINE_DIRECTIONS } from "./PlayerDrill.js";

export const PLAYER_STATES = {
	STANDING: 0,
	MINING: 1,
	FALLING: 2,
	FLYING: 3,
};

export class State {
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
	move(keys) {
		if (keys["KeyA"]) this.player.moveLeft();
		if (keys["KeyS"]) this.player.moveDown();
		if (keys["KeyD"]) this.player.moveRight();
	}
}

export class StandingState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.STANDING);
	}

	enter() {
		console.log("entering standing state");
	}

	handleInput({ keys }) {
		if (keys["KeyW"]) this.player.actionState.changeState(PLAYER_STATES.FLYING);

		if ((keys["Space"] && keys["KeyA"]) || (keys["Space"] && keys["KeyD"]) || (keys["Space"] && keys["KeyS"])) {
			this.player.actionState.changeState(PLAYER_STATES.MINING);
		}
		this.move(keys);
	}

	update() {
		let new_pos = new Vect2(this.player.pos.x, this.player.pos.y + this.player.gravity.velocity);
		let c1 = this.player.collision.calculateCorners(new_pos);
		const corners = [c1[CORNERS.BOTTOM_LEFT], c1[CORNERS.BOTTOM_RIGHT]];

		if (!this.player.collision.collideDown(corners)) {
			// player isnt grounded, switch to FallingState
			this.player.actionState.changeState(PLAYER_STATES.FALLING);
		}

		this.player.gravity.reset();
	}
}

export class MiningState extends Movements {
	constructor(player) {
		super(player, PLAYER_STATES.MINING);
	}

	enter() {
		console.log("entering mining state");
	}

	handleInput({ keys }) {
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

export class FallingState extends Movements {
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

export class FlyingState extends Movements {
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

export default class PlayerState {
	constructor(player) {
		this.states = [
			new StandingState(player),
			new MiningState(player),
			new FallingState(player),
			new FlyingState(player),
		];
		this.currentState = this.states[PLAYER_STATES.STANDING];
	}

	changeState(newState) {
		if (!this.states[newState]) return;
		this.currentState = this.states[newState];
		this.currentState.enter();
	}

	update(input) {
		this.currentState.handleInput(input);
		this.currentState.update?.call(this.currentState);
	}
}
