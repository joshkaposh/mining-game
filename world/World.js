import Player from "../player/Player.js";
import Drawer from "../Draw.js";
import { generateGrid, generateBackground, Range } from "./generate.js";
import Camera, { offsetToCenter } from "../camera/Camera.js";
import Shop from "../shop/Shop.js";
import { TILE_VALUES } from "./TileEnum.js";

const tile_spritesheet = document.getElementById("tile_spritesheet");
const ore_spritesheet = document.getElementById("ore_spritesheet");
const player_spritesheet = document.getElementById("player_spritesheet");

// console.log(document.images);
// console.log(tile_spritesheet);

class Boundary {
	constructor(xMin, yMin, xMax, yMax) {
		this.xMin = xMin;
		this.yMin = yMin;
		this.xMax = xMax;
		this.yMax = yMax;
	}
}

const LAYER_INDICES = {
	BACKGROUND: 0,
	GROUND: 1,
};

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
		this.layers = [[], []]; //! 0-background, 1-ground

		this.player = null;
		this.camera = null;
		this.shop = null;
		this.mouse = {
			x: null,
			y: null,
		};
		const moveMouse = (e) => {
			this.mouse.x = e.x;
			this.mouse.y = e.y;
		};

		this.c.canvas.addEventListener("mousedown", (e) => {
			moveMouse(e);

			let x = this.camera.pos.x + this.mouse.x;
			let y = this.camera.pos.y + this.mouse.y;

			const offset = { x, y };

			const tile = this.getTileByPos(offset);
			console.log(tile);
			tile.clicked = !tile.clicked;
			tile.changeType(0);
			tile.updateSurroundings();
		});

		this.c.canvas.addEventListener("mousemove", moveMouse);
	}

	getTileByPos(pos) {
		return this.getTile(1, Math.floor(pos.x / this.tilesize), Math.floor(pos.y / this.tilesize));
	}

	getTile(layer, col, row) {
		// console.log(layer, col, row);
		return this.layers[layer][row * this.cols + col];
	}

	drawTiles(camera) {
		let startCol = Math.floor(camera.pos.x / this.tilesize);
		let endCol = startCol + camera.width / this.tilesize;
		let startRow = Math.floor(camera.pos.y / this.tilesize);
		let endRow = startRow + camera.height / this.tilesize;

		let offsetX = -camera.pos.x + startCol * this.tilesize;
		let offsetY = -camera.pos.y + startRow * this.tilesize;

		for (let layer = 0; layer < this.layers.length; layer++) {
			for (let y = startRow; y < endRow; y++) {
				for (let x = startCol; x < endCol; x++) {
					const tile = this.getTile(layer, x, y);

					let tile_x = Math.round((x - startCol) * this.tilesize + offsetX);
					let tile_y = Math.round((y - startRow) * this.tilesize + offsetY);
					const offset = new Vect2(tile_x, tile_y);

					if (layer === LAYER_INDICES.BACKGROUND) {
						tile?.drawSprite(
							this.Draw,
							offset,
							tile_spritesheet,
							tile.frameX,
							tile.frameY,
							this.tilesize / 2,
							this.tilesize / 2,
							2
						);
					}

					if (layer === LAYER_INDICES.GROUND && tile?.value !== TILE_VALUES.EMPTY) {
						tile.drawSprite(
							this.Draw,
							offset,
							tile_spritesheet,
							tile.frameX,
							tile.frameY,
							this.tilesize / 2,
							this.tilesize / 2,
							2
						);

						if (tile.ore) {
							tile.drawSprite(
								this.Draw,
								offset,
								ore_spritesheet,
								tile.ore.frameX,
								tile.ore.frameY,
								this.tilesize / 2,
								this.tilesize / 2,
								1
							);
						}
					}
				}
			}
		}
	}

	init(displayWidth, displayHeight) {
		generateBackground(
			this.layers[LAYER_INDICES.BACKGROUND],
			this.cols,
			this.rows,
			this.tilesize,
			this.ranges.tiles
		);
		generateGrid(
			this.layers[LAYER_INDICES.GROUND],
			this.cols,
			this.rows,
			this.tilesize,
			this.ranges,
			this.getTile.bind(this, LAYER_INDICES.GROUND)
		);
		this.spawnPlayer();
		const shopPos = { x: Math.floor(this.worldW / 3), y: (this.tileRanges.AIR.max - 2) * this.tilesize };
		this.shop = new Shop(this.c, shopPos.x, shopPos.y, this.tilesize * 3, this.tilesize * 2, "grey");
		this.shop.init(displayWidth, displayHeight);
		this.camera = new Camera(0, 0, displayWidth, displayHeight, this);
		this.camera.follow(this.player);
	}

	spawnPlayer() {
		const playerWidth = this.tilesize / 3;
		const playerHeight = this.tilesize - this.tilesize / 5;
		// pos, velocity, flySpeed, width, height, tilesize, worldW, worldH, getTile

		this.player = new Player(
			this.c,
			100,
			new Vect2(0, 0),
			new Vect2(200, 200), //default is 75
			new Vect2(0, 200),
			playerWidth,
			playerHeight,
			this.tilesize,
			this.worldW,
			this.worldH,
			this.getTile.bind(this, LAYER_INDICES.GROUND)
		);
	}

	update() {
		this.player.update(this.shop);
		this.camera.update();
	}

	render() {
		const offset = offsetToCenter(
			this.player.pos,
			this.camera.pos,
			this.c.canvas.width,
			this.c.canvas.height,
			this.camera.width,
			this.camera.height
		);

		this.drawTiles(this.camera);
		this.Draw.drawCircle(this.mouse.x, this.mouse.y, 5, false);
		// this.camera.draw(this.Draw);
		this.shop.draw(
			offsetToCenter(
				this.shop.pos,
				this.camera.pos,
				this.c.canvas.width,
				this.c.canvas.height,
				this.camera.width,
				this.camera.height
			)
		);
		// this.player.draw(offset);
		this.Draw.drawRect(offset.x, offset.y, this.player.width, this.player.height, true);
		this.player.sprite.draw(this.Draw, offset);
		this.player.drawStats();

		// this.player.sprite.drawSprite(this.Draw, offset, player_spritesheet, 0, 0, 32, 32, 2);
	}
}
