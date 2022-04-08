import { TILE_TYPES, TILE_VALUES, ORE_TYPES } from "../world/TileEnum.js";

export const MINE_DIRECTIONS = {
	LEFT: 0,
	RIGHT: 1,
	DOWN: 2,
};

export default class PlayerDrill {
	constructor(inventory, collision, drill_speed, reach) {
		this.inventory = inventory;
		this.collision = collision;
		this.drill_speed = drill_speed;
		this.reach = reach;
		this.miningPoint = new Vect2(null, null);
	}

	mineTile(tile) {
		if (!tile) return;

		let new_integrity = tile.integrity - this.drill_speed;

		if (new_integrity <= 0) {
			// console.log(tile);
			// destroyed tile
			tile.mined = true;
			tile.integrity = 0;
			if (tile.ore) this.inventory.add(tile.ore.type);

			tile.changeType(TILE_VALUES.EMPTY);
			tile.updateSurroundings();
			return;
		}

		tile.integrity = new_integrity;
	}

	isMineable(tile) {
		if (tile) {
			if (!tile.walkable && !tile.mined) {
				return true;
			}
			return false;
		}
	}

	canMineTile(pos, dir) {
		// * takes in player.pos, requested mining direction;
		// * if there is a tile, and tile isnt walkable && tile hasnt been mined, return true
		// * else return false
		let bool, tile;

		switch (dir) {
			case MINE_DIRECTIONS.LEFT:
				tile = this.collision.getTileByPos(this.getMiningPointLeft(pos));
				this.isMineable(tile) ? (bool = true) : (bool = false);
				break;

			case MINE_DIRECTIONS.RIGHT:
				tile = this.collision.getTileByPos(this.getMiningPointRight(pos));
				this.isMineable(tile) ? (bool = true) : (bool = false);
				break;
			case MINE_DIRECTIONS.DOWN:
				tile = this.collision.getTileByPos(this.getMiningPointDown(pos));
				this.isMineable(tile) ? (bool = true) : (bool = false);
				break;
		}
		return bool;
	}

	getMiningPointLeft(pos) {
		return new Vect2(pos.x - this.reach, pos.y + this.collision.height * 0.5);
	}

	getMiningPointRight(pos) {
		return new Vect2(pos.x + this.collision.width + this.reach, pos.y + this.collision.height * 0.5);
	}

	getMiningPointDown(pos) {
		let bottomOfPlayer = this.collision.getBottom(pos);
		return new Vect2(pos.x + this.collision.width * 0.5, bottomOfPlayer + this.reach);
	}

	setMiningPointLeft(pos) {
		this.miningPoint = this.getMiningPointLeft(pos);
	}

	setMiningPointRight(pos) {
		this.miningPoint = this.getMiningPointRight(pos);
	}

	setMiningPointDown(pos) {
		this.miningPoint = this.getMiningPointDown(pos);
	}

	mineLeft() {
		const tile = this.collision.getTileByPos(this.miningPoint);
		this.mineTile(tile);
	}

	mineRight() {
		const tile = this.collision.getTileByPos(this.miningPoint);
		this.mineTile(tile);
	}

	mineDown() {
		const tile = this.collision.getTileByPos(this.miningPoint);
		this.mineTile(tile);
	}
}
