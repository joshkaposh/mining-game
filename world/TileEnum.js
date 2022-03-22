export const TILE_VALUES = {
	AIR: 0,
	GRASS: 1,
	DIRT: 2,
};

export const ORE_VALUES = {
	COPPER: 0,
	IRON: 1,
};

export const ORE_TYPES = [
	{
		type: "COPPER",
		color: "orange",
		integrity: 50,
		rarity: 0.25,
		// gets range from world generation
		// " rarity " " "
	},
	{
		type: "IRON",
		color: "grey",
		integrity: 100,
		rarity: 0.25,

		// gets range from world generation
		// " rarity " " "
	},
];

export const TILE_TYPES = [
	{
		type: "AIR",
		value: 0,
		integrity: 0,
		walkable: true,
		color: "lightblue",
	},
	{
		type: "GRASS",
		value: 1,
		integrity: 50,
		walkable: false,
		// ore: ORE_TYPES.BRONZE,
		// oreType: "BRONZE",
		color: "lightgreen",
	},
	{
		type: "DIRT",
		value: 2,
		integrity: 50,
		walkable: false,
		// ore: ORE_TYPES.BRONZE,
		// oreType: "BRONZE",
		color: "brown",
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
