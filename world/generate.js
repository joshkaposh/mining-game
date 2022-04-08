import Tile from "./Tile.js";
import {
	TILE_TYPES,
	TILE_VALUES,
	BACKGROUND_TILE_TYPES,
	BACKGROUND_TILE_VALUES,
	ORE_TYPES,
	ORE_VALUES,
} from "./TileEnum.js";

export class Range {
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}
}

const calculateBlockCount = (range, cols, rarity) => (range.max - range.min) * cols * rarity;

const generateOre = (ore, cols, rows, getTile) => {
	let count = Math.floor(calculateBlockCount(ore.range, cols, ore.rarity));
	// console.log("cols: ", cols);
	// console.log("rows: ", rows);

	const recursivePickTile = (count) => {
		// console.log(count);
		if (count === 0) return;

		let x = randIntFromRange(0, cols);
		let y = randIntFromRange(ore.range.min, ore.range.max);
		let randTile = getTile(x, y);

		if (!randTile.ore) {
			randTile.ore = ore;

			// console.log(randTile);

			recursivePickTile(count - 1);
		} else {
			recursivePickTile(count);
		}
	};
	recursivePickTile(count);
};
const generateOres = (cols, rows, oreRanges, getTile) => {
	const ores = Object.keys(oreRanges);
	for (let i = 0; i < ores.length; i++) {
		const oreType = ORE_TYPES[ORE_VALUES[ores[i]]];
		const oreRange = oreRanges[ores[i]];
		oreType.range = oreRange;
		// console.log(oreType);

		generateOre(oreType, cols, rows, getTile);
	}
};

const generateTile = (grid, x, y, tilesize, tileType) => {
	grid.push(new Tile(x, y, tilesize, tileType));
};

const generateTiles = (grid, cols, rows, tilesize, { AIR, GRASS }) => {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (y < AIR.max) {
				generateTile(grid, x, y, tilesize, TILE_TYPES[TILE_VALUES.EMPTY]);
			} else if (y < GRASS.max) {
				generateTile(grid, x, y, tilesize, TILE_TYPES[TILE_VALUES.GRASS]);
			} else {
				generateTile(grid, x, y, tilesize, TILE_TYPES[TILE_VALUES.DIRT]);
			}
		}
	}
};

const generateAirBlocks = (cols, rows, tileRanges, getTile) => {
	let min = tileRanges.DIRT.min;
	let max = tileRanges.DIRT.max;
	let rarity = 0.15;

	let count = Math.floor(calculateBlockCount(new Range(min, max), cols, rarity));

	const recursivePickTile = (count) => {
		// console.log(count);
		if (count === 0) return;

		let x = randIntFromRange(0, cols);
		let y = randIntFromRange(min, max);
		let randTile = getTile(x, y);

		if (!randTile.ore) {
			randTile.changeType(TILE_VALUES.EMPTY);

			// console.log(randTile);

			recursivePickTile(count - 1);
		} else {
			recursivePickTile(count);
		}
	};
	recursivePickTile(count);
};

function addTileSurroundings(minCol, minRow, maxCol, maxRow, getTile) {
	for (let row = minRow; row < maxRow; row++) {
		for (let col = minCol; col < maxCol; col++) {
			const tile = getTile(col, row);
			tile.addSurroundings(minCol, minRow, maxCol, maxRow, getTile);
		}
	}
}

export function generateBackground(grid, cols, rows, tilesize, { AIR }) {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (y < AIR.max) {
				generateTile(grid, x, y, tilesize, BACKGROUND_TILE_TYPES[BACKGROUND_TILE_VALUES.AIR]);
			} else if (y === AIR.max) {
				generateTile(grid, x, y, tilesize, BACKGROUND_TILE_TYPES[BACKGROUND_TILE_VALUES.SURFACE]);
			} else {
				generateTile(grid, x, y, tilesize, BACKGROUND_TILE_TYPES[BACKGROUND_TILE_VALUES.UNDERGROUND]);
			}

			// grid.push(new Tile(x, y, tilesize, TILE_TYPES[TILE_VALUES.AIR]));
		}
	}
}

export function generateGrid(grid, cols, rows, tilesize, ranges, getTile) {
	generateTiles(grid, cols, rows, tilesize, ranges.tiles);
	generateOres(cols, rows, ranges.ores, getTile);
	generateAirBlocks(cols, rows, ranges.tiles, getTile);
	addTileSurroundings(0, 0, cols, rows, getTile);
}
