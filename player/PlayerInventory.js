import { ORE_TYPES, ORE_VALUES } from "../world/TileEnum.js";

export default class PlayerInventory {
	constructor() {
		this.ores = [];
		Object.keys(ORE_TYPES).forEach((_) => {
			this.ores.push([]);
		});
		console.log(this.ores);
	}

	getOreArray(oreType) {
		if (this.exists(oreType)) return this.ores[ORE_VALUES[oreType]];
	}

	exists(oreType) {
		if (ORE_TYPES[ORE_VALUES[oreType]]) return true;
		return false;
	}

	add(oreType) {
		this.getOreArray(oreType).push(1);

		console.log(oreType, this.ores[ORE_VALUES[oreType]]);

		// console.log(this.ores);
	}

	updateUI() {
		const ores = Object.keys(ORE_VALUES);
		for (let i = 0; i < ores.length; i++) {
			const oreCountTag = document.getElementById(`${ores[i]}-count`);
			let count = this.ores[ORE_VALUES[ores[i]]];
			// console.log("ore-count: ", count.length);
			oreCountTag.innerText = count.length;
		}
	}
}
