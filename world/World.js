import Player from "../player/Player.js";
import Drawer from "../Draw.js";
import { generateGrid, Range } from "./generate.js";

class Boundary {
	constructor(xMin, yMin, xMax, yMax) {
		this.xMin = xMin;
		this.yMin = yMin;
		this.xMax = xMax;
		this.yMax = yMax;
	}
}

export default class World {
	constructor(c, width, height, cols, rows, tilesize) {
		this.c = c;
		this.Draw = new Drawer(c);
		this.boundary = new Boundary(0, 0, width, height);
		this.cols = cols;
		this.rows = rows;
		this.tilesize = tilesize;
		this.worldW = cols * tilesize;
		this.worldH = rows * tilesize;

		this.tileRanges = {
			AIR: new Range(this.boundary.yMin, Math.floor(4)),
			GRASS: new Range(Math.floor(4) + 1, Math.floor(4) + 1),
			DIRT: new Range(Math.floor(4) + 2, Math.floor(this.rows)),
		};
		this.oreRanges = {
			IRON: new Range(this.tileRanges.DIRT.min, this.tileRanges.DIRT.max),
			COPPER: new Range(this.tileRanges.DIRT.min, this.tileRanges.DIRT.max),
		};

		this.ranges = {
			tiles: this.tileRanges,
			ores: this.oreRanges,
		};
		console.log(this.ranges);
		this.grid = [];
		this.player = null;
	}

	// getRanges() {
	// 	return { tileRanges: this.tileRanges, oreRanges: this.oreRanges };
	// }

	getTile(col, row) {
		return this.grid[row * this.cols + col];
	}

	drawTile(tile) {
		this.Draw.setFill(tile.color);
		this.Draw.drawRect(tile.x, tile.y, this.tilesize, this.tilesize, true);

		if (tile.ore && !tile.mined) {
			this.Draw.setFill(tile.ore.color);
			this.Draw.drawRect(
				tile.x + tile.tilesize / 2,
				tile.y + tile.tilesize / 2,
				Math.floor(tile.tilesize / 4),
				Math.floor(tile.tilesize / 4),
				true
			);
		}
	}

	drawTiles() {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const tile = this.getTile(x, y);
				this.drawTile(tile);
			}
		}
	}

	init() {
		generateGrid(this.grid, this.cols, this.rows, this.tilesize, this.ranges, this.getTile.bind(this));
		this.spawnPlayer();
	}

	spawnPlayer() {
		this.player = new Player(
			this.c,
			100,
			new Vect2(0, 0),
			new Vect2(75, 75),
			new Vect2(0, 200),
			this.tilesize * 0.75,
			this.tilesize * 0.6,
			this.tilesize,
			this.worldW,
			this.worldH,
			this.getTile.bind(this)
		);
	}

	update() {
		this.drawTiles();

		this.player.update();
		this.player.draw();
	}
}
