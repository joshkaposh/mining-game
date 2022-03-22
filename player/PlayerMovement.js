import PlayerEntity from "./PlayerEntity.js";
import { CORNERS } from "./PlayerCollision.js";

export default class PlayerMovement extends PlayerEntity {
	// health, pos, velocity, width, height, tilesize, getTile
	constructor(health, pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile) {
		super(health, pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile);
		this.trackedMoves = [];
	}

	moveLeft() {
		let new_pos = new Vect2(lerp(this.pos.x, this.pos.x - this.velocity.x, time.delta), this.pos.y);
		let temp = this.collision.calculateCorners(new_pos);
		const corners = [temp[CORNERS.TOP_LEFT], temp[CORNERS.BOTTOM_LEFT]];

		if (this.collision.collideWorldLeft(corners)) return;
		if (this.collision.collideLeft(corners)) return;

		this.pos.x = new_pos.x;
	}

	moveRight() {
		let new_pos = new Vect2(lerp(this.pos.x, this.pos.x + this.velocity.x, time.delta), this.pos.y);
		let temp = this.collision.calculateCorners(new_pos);
		const corners = [temp[CORNERS.TOP_RIGHT], temp[CORNERS.BOTTOM_RIGHT]];

		if (this.collision.collideWorldRight(corners)) return;
		if (this.collision.collideRight(corners)) return;

		this.pos.x = new_pos.x;
	}

	moveUp() {
		let new_pos = new Vect2(this.pos.x, lerp(this.pos.y, this.pos.y - this.flySpeed.y, time.delta));
		let temp = this.collision.calculateCorners(new_pos);
		const corners = [temp[CORNERS.TOP_LEFT], temp[CORNERS.TOP_RIGHT]];

		if (this.collision.collideWorldUp(corners)) return;
		if (this.collision.collideUp(corners)) return;

		this.pos.y = new_pos.y;
	}

	moveDown() {
		let new_pos = new Vect2(this.pos.x, lerp(this.pos.y, this.pos.y + this.velocity.y, time.delta));
		let temp = this.collision.calculateCorners(new_pos);
		const corners = [temp[CORNERS.BOTTOM_LEFT], temp[CORNERS.BOTTOM_RIGHT]];

		if (this.collision.collideWorldDown(corners)) return;
		if (this.collision.collideDown(corners)) return;

		this.pos.y = new_pos.y;
	}
}
