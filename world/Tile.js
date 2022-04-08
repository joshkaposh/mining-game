import { TILE_TYPES, TILE_VALUES, ORE_TYPES, TILE_STATES } from "./TileEnum.js";
import { TileSprite } from "../sprites/Sprite.js";
const integrityPercents = (integrity) => {
	const percents = {};

	const eighth = 1 / 8;
	for (let i = 1; i <= 8; i++) {
		let percent = eighth * i;
		percents[percent] = lerp(0, integrity, percent);
	}
};

//
/* 
! TILE_SURROUNDINGS:
? 0: left, 1: right, 2:top, 3: bottom,
*/

export default class Tile extends TileSprite {
	constructor(col, row, tilesize, type) {
		// tileWidth, tileHeight, scale, frameX, frameY
		super(tilesize / 2, tilesize / 2, 2, type.frameX, type.frameY);
		this.col = col;
		this.row = row;
		this.tilesize = tilesize;
		this.x = col * tilesize;
		this.y = row * tilesize;
		this.value = type.value;
		this.integrity = type.integrity;
		this.walkable = type.walkable;
		this.color = type.color;
		this.oreType = type.oreType;
		this.ore = type.ore;
		this.mined = false;
		this.clicked = false;
		this.state = TILE_STATES.DEFAULT;
		this.integrityPercents = integrityPercents(type.integrity);
		//! add ability for drill to read and set tile frames
		//! based on integrity percentage

		this.surroundings = []; // ! 3x3 left to right, top to bottom WITHOUT MIDDLE
	}

	isNeighbourAir(index) {
		return this.surroundings[index]?.value === TILE_VALUES.AIR;
	}

	isAir() {
		if (this?.value === TILE_VALUES.AIR) return true;
		return false;
	}

	addSurroundings(minCol, minRow, maxCol, maxRow, getTile) {
		let col = this.col;
		let row = this.row;
		// top layer;
		if (col - 1 >= minCol && row - 1 >= minRow) this.surroundings.push(getTile(col - 1, row - 1));
		if (row - 1 >= minRow) this.surroundings.push(getTile(col, row - 1));
		if (col + 1 <= maxCol && row - 1 >= minRow) this.surroundings.push(getTile(col + 1, row - 1));
		//middle layer
		if (col - 1 >= minCol) this.surroundings.push(getTile(col - 1, row));
		if (col + 1 <= maxCol) this.surroundings.push(getTile(col + 1, row));
		// bottom layer
		if (col - 1 >= minCol && row + 1 <= maxRow) this.surroundings.push(getTile(col - 1, row + 1));
		if (row + 1 <= maxRow) this.surroundings.push(getTile(col, row + 1));
		if (col + 1 <= maxCol && row + 1 <= maxRow) this.surroundings.push(getTile(col + 1, row + 1));
	}

	checkSurroundingsBlocks() {
		return [
			!this.isNeighbourAir(0),
			!this.isNeighbourAir(1),
			!this.isNeighbourAir(2),

			!this.isNeighbourAir(3),
			!this.isNeighbourAir(4),

			!this.isNeighbourAir(5),
			!this.isNeighbourAir(6),
			!this.isNeighbourAir(7),
		];
	}

	drawSurroundings(Draw, offset) {
		let size = this.tilesize / 3;
		// top
		if (!this.isNeighbourAir(0)) Draw.drawRect(offset.x, offset.y, size, size, false);
		if (!this.isNeighbourAir(1)) Draw.drawRect(offset.x + size, offset.y, size, size, false);
		if (!this.isNeighbourAir(2)) Draw.drawRect(offset.x + size * 2, offset.y, size, size, false);
		// middle
		if (!this.isNeighbourAir(3)) Draw.drawRect(offset.x, offset.y + size, size, size, false);
		if (!this.isNeighbourAir(4)) Draw.drawRect(offset.x + size * 2, offset.y + size, size, size, false);
		// bottom
		if (!this.isNeighbourAir(5)) Draw.drawRect(offset.x, offset.y + size * 2, size, size, false);
		if (!this.isNeighbourAir(6)) Draw.drawRect(offset.x + size, offset.y + size * 2, size, size, false);
		if (!this.isNeighbourAir(7)) Draw.drawRect(offset.x + size * 2, offset.y + size * 2, size, size, false);
	}

	updateSurroundings() {
		const surroundings = this.checkSurroundingsBlocks();
		console.log(surroundings);
		//! figure out how to apply this logic
		//! to all surrounding tiles when tile is mined

		//* bottom left/right inside corners
		if (surroundings[1] && surroundings[0] && surroundings[3])
			this.surroundings[0].state = TILE_STATES.INSIDE_BOTTOM_RIGHT;
		if (surroundings[1] && surroundings[2] && surroundings[4])
			this.surroundings[2].state = TILE_STATES.INSIDE_BOTTOM_LEFT;
		//* top left/right inside corners
		if (surroundings[6] && surroundings[5]) this.surroundings[5].state = TILE_STATES.INSIDE_TOP_RIGHT;
		if (surroundings[6] && surroundings[7]) this.surroundings[7].state = TILE_STATES.INSIDE_TOP_LEFT;

		//* bottom wall
		if (surroundings[0] && surroundings[1] && surroundings[2]) this.surroundings[1].state = TILE_STATES.BOTTOM;

		//* bottom left corner
		if (!surroundings[0] && surroundings[1] && surroundings[2])
			this.surroundings[1].state = TILE_STATES.BOTTOM_LEFT;

		//* bottom right corner
		if (surroundings[0] && surroundings[1] && !surroundings[2])
			this.surroundings[1].state = TILE_STATES.BOTTOM_RIGHT;
		//* left/right walls
		if (surroundings[3]) this.surroundings[3].state = TILE_STATES.RIGHT;
		if (surroundings[4]) this.surroundings[4].state = TILE_STATES.LEFT;
	}

	drawOre(Draw, offset) {
		Draw.setFill(this.ore.color);
		Draw.drawRect(
			offset.x + this.tilesize / 2,
			offset.y + this.tilesize / 2,
			Math.floor(this.tilesize / 4),
			Math.floor(this.tilesize / 4),
			true
		);
	}

	draw(Draw, offset) {
		Draw.setFill(this.color);
		Draw.drawRect(offset.x, offset.y, this.tilesize, this.tilesize, true);
		// draw tile state
		Draw.setFill();
		Draw.drawText(this.state, "black", offset.x + this.tilesize / 2, offset.y + this.tilesize / 2);

		if (this.ore && !this.mined) this.drawOre(Draw, offset);

		if (this.clicked) {
			// Draw.drawRect(offset.x, offset.y, this.tilesize, this.tilesize, false);
			// draw tile outline
			this.drawSurroundings(Draw, offset);
		}
	}

	changeType(tileValue) {
		this.value = TILE_TYPES[tileValue].value;
		this.integrity = TILE_TYPES[tileValue].integrity;
		this.walkable = TILE_TYPES[tileValue].walkable;
		this.color = TILE_TYPES[tileValue].color;
	}
}
