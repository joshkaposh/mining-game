import { boxTileCollision, centerOfBox } from "../physics.js";
export const CORNERS = {
	TOP_LEFT: 0,
	TOP_RIGHT: 1,
	BOTTOM_LEFT: 2,

	BOTTOM_RIGHT: 3,
};

export default class PlayerCollision {
	constructor(width, height, tilesize, worldW, worldH, getTile) {
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		this.worldW = worldW;
		this.worldH = worldH;
		this.getTile = getTile;
		console.log(this);
	}

	getTileByPos(pos) {
		return this.getTile(Math.floor(pos.x / this.tilesize), Math.floor(pos.y / this.tilesize));
	}

	getRight(pos) {
		return pos.x + this.width;
	}
	getBottom(pos) {
		return pos.y + this.height;
	}

	centerOfPlayer(pos) {
		return centerOfBox(pos, this.width, this.height);
	}

	calculateCorners(pos) {
		return [
			//! 0: t-left 1: t-right 2: b-right 3: b-left
			new Vect2(pos.x, pos.y),
			new Vect2(pos.x + this.width, pos.y),
			new Vect2(pos.x, pos.y + this.height),
			new Vect2(pos.x + this.width, pos.y + this.height),
		];
	}

	collideWorldUp(corners) {
		let bool = false;
		for (const corner of corners) {
			if (corner.y < 0) {
				bool = true;
			}
		}
		return bool;
	}

	collideWorldDown(corners) {
		let bool = false;
		for (const corner of corners) {
			if (corner.y > this.worldH) {
				bool = true;
			}
		}
		return bool;
	}

	collideWorldLeft(corners) {
		let bool = false;
		for (const corner of corners) {
			if (corner.x < 0) {
				bool = true;
			}
		}
		return bool;
	}

	collideWorldRight(corners) {
		let bool = false;
		for (const corner of corners) {
			if (corner.x > this.worldW) {
				bool = true;
			}
		}
		return bool;
	}

	collideUp(corners) {
		//checks adjacent tile bottom border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTileByPos(corners[i]);

			if (tile) {
				if (
					corners[i].y < tile.y + this.tilesize &&
					corners[i].x > tile.x &&
					corners[i].x < tile.x + this.tilesize
				) {
					if (!tile?.walkable) bool = true;
				}
			}
		}

		return bool;
	}

	collideDown(corners) {
		//checks adjecent tile top border
		let bool = false;
		for (const corner of corners) {
			let tile = this.getTileByPos(corner);

			if (tile && boxTileCollision({ pos: corner, width: this.width, height: this.height }, tile)) {
				return true;
			}
		}

		return bool;
	}

	collideLeft(corners) {
		//checks adjacent tile right border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTileByPos(corners[i]);
			if (tile) {
				if (
					corners[i].x < tile.x + this.tilesize &&
					corners[i].y > tile.y &&
					corners[i].y < tile.y + this.tilesize
				) {
					if (!tile?.walkable) bool = true;
				}
			}
		}
		return bool;
	}

	collideRight(corners) {
		//checks adjacent tile left border
		let bool = false;

		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTileByPos(corners[i]);

			if (tile) {
				if (corners[i].x > tile.x && corners[i].y > tile.y && corners[i].y < tile.y + this.tilesize) {
					if (!tile?.walkable) bool = true;
				}
			}
		}
		return bool;
	}
}
