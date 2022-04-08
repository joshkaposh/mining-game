export const BACKGROUND_TILE_VALUES = {
	AIR: 0,
	SURFACE: 1,
	UNDERGROUND: 2,
};

export const TILE_VALUES = {
	EMPTY: 0,
	GRASS: 1,
	DIRT: 2,
	// HARDENING_DIRT:3,
	// HARDENED_DIRT:4,
};

export const ORE_VALUES = {
	COPPER: 0,
	IRON: 1,
};

// ! aseprite - create general grass breaking

export const TILE_STATES = {
	DEFAULT: 0,

	RIGHT: 1,
	LEFT: 2,
	TOP: 3,
	BOTTOM: 4,

	TOP_RIGHT: 5,
	TOP_LEFT: 6,
	BOTTOM_RIGHT: 7,
	BOTTOM_LEFT: 8,

	BOTH_LEFT: 9,
	BOTH_RIGHT: 10,
	BOTH_TOP: 11,
	BOTH_BOTTOM: 12,

	INSIDE_TOP_RIGHT: 13,
	INSIDE_TOP_LEFT: 14,
	INSIDE_BOTTOM_RIGHT: 15,
	INSIDE_BOTTOM_LEFT: 16,
};

export const ORE_TYPES = [
	{
		type: "COPPER",
		color: "orange",
		integrity: 50,
		rarity: 0.25,
		cost: 25,
		frameX: 0,
		frameY: 0,
		// gets range from world generation
		// " rarity " " "
	},
	{
		type: "IRON",
		color: "grey",
		integrity: 100,
		rarity: 0.25,
		cost: 50,
		frameX: 1,
		frameY: 0,
		// gets range from world generation
		// " rarity " " "
	},
];

export const BACKGROUND_TILE_TYPES = [
	{
		type: "AIR",
		value: 0,
		integrity: 0,
		walkable: true,
		color: "lightblue",
		frameX: 0,
		frameY: 0,
	},
	{
		type: "SURFACE",
		value: 0,
		integrity: 0,
		walkable: true,
		color: "lightblue",
		frameX: 1,
		frameY: 0,
	},
	{
		type: "UNDERGROUND",
		value: 0,
		integrity: 0,
		walkable: true,
		color: "lightblue",
		frameX: 2,
		frameY: 0,
	},
];

export const TILE_TYPES = [
	{
		type: "EMPTY",
		color: "transparent",
		value: 0,
		integrity: 0,
		walkable: true,
		frameX: TILE_STATES.DEFAULT,
		frameY: 1,
	},
	{
		type: "GRASS",
		color: "lightgreen",
		value: 1,
		integrity: 50,
		walkable: false,
		frameX: TILE_STATES.DEFAULT,
		frameY: 1,
	},
	{
		type: "DIRT",
		color: "brown",
		value: 2,
		integrity: 50,
		walkable: false,
		frameX: TILE_STATES.DEFAULT,
		frameY: 2,
	},
];

// export const TILE_WALKABLES = {
// 	AIR: true,
// 	GRASS: false,
// 	DIRT: false,
// };

// export const TILE_COLORS = {
// 	AIR: "lightblue",
// 	GRASS: "lightgreen",
// 	DIRT: "brown",
// };
