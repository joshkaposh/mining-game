import Tile from "./Tile.js";
import { TILE_TYPES, TILE_VALUES, ORE_TYPES, ORE_VALUES } from "./TileEnum.js";

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

	const recPickTile = (count) => {
		// console.log(count);
		if (count === 0) return;

		let x = randIntFromRange(0, cols);
		let y = randIntFromRange(ore.range.min, ore.range.max);
		let randTile = getTile(x, y);

		if (!randTile.ore) {
			randTile.ore = ore;

			// console.log(randTile);

			recPickTile(count - 1);
		} else {
			recPickTile(count);
		}
	};
	recPickTile(count);
};
const generateOres = (cols, rows, oreRanges, getTile) => {
	const ores = Object.keys(oreRanges);
	for (let i = 0; i < ores.length; i++) {
		const oreType = ORE_TYPES[ORE_VALUES[ores[i]]];
		const oreRange = oreRanges[ores[i]];
		console.log(oreType);
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
				generateTile(grid, x, y, tilesize, TILE_TYPES[TILE_VALUES.AIR]);
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

	const recPickTile = (count) => {
		// console.log(count);
		if (count === 0) return;

		let x = randIntFromRange(0, cols);
		let y = randIntFromRange(min, max);
		let randTile = getTile(x, y);

		if (!randTile.ore) {
			randTile.changeType(TILE_VALUES.AIR);

			// console.log(randTile);

			recPickTile(count - 1);
		} else {
			recPickTile(count);
		}
	};
	recPickTile(count);
};

export function generateGrid(grid, cols, rows, tilesize, ranges, getTile) {
	generateTiles(grid, cols, rows, tilesize, ranges.tiles);
	generateOres(cols, rows, ranges.ores, getTile);
	generateAirBlocks(cols, rows, ranges.tiles, getTile);
}
