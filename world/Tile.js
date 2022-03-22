import { TILE_TYPES, ORE_TYPES } from "./TileEnum.js";

export default class Tile {
	constructor(col, row, tilesize, type) {
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
	}

	changeType(tileValue) {
		this.value = TILE_TYPES[tileValue].value;
		this.integrity = TILE_TYPES[tileValue].integrity;
		this.walkable = TILE_TYPES[tileValue].walkable;
		this.color = TILE_TYPES[tileValue].color;
	}

	// 	draw(Draw) {
	// 		Draw.setStroke(this.color);
	// 		Draw.drawRect(this.x, this.y, this.tilesize, this.tilesize, false);

	// 		console.log(this.ore);
	// 	}
}
