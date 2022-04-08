import { ORE_TYPES, ORE_VALUES } from "../world/TileEnum.js";

export default class PlayerInventory {
	constructor() {
		this.ores = [];
		this.money = 0;

		Object.keys(ORE_TYPES).forEach((_) => {
			this.ores.push([]);
		});
		for (let i = 0; i < ORE_TYPES.length; i++) {
			console.log(ORE_TYPES[i]);
			const sellBtn = document.getElementById(`${ORE_TYPES[i].type}-sell`);
			sellBtn.addEventListener("click", this.sell.bind(this, ORE_TYPES[i].type));
		}
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

	sell(oreType) {
		const oresArray = this.getOreArray(oreType);
		if (oresArray.length === 0) return;
		const profit = ORE_TYPES[ORE_VALUES[oreType]].cost;
		this.money += profit;

		oresArray.pop(1);
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
