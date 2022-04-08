import Drawer from "../Draw.js";
import { boxCollision } from "../physics.js";

export default class Shop {
	constructor(c, x, y, width, height, color) {
		this.Draw = new Drawer(c);
		this.pos = new Vect2(x, y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.isOpen = false;
	}

	init(sWidth, sHeight) {
		const tag = document.getElementById("inventory");

		tag.style.display = "none";
		tag.style.width = sWidth + "px";
		tag.style.height = sHeight + "px";
	}

	collideWithPlayer(player) {
		if (boxCollision(player, this)) return true;
		return false;
	}

	draw(offset) {
		this.Draw.setFill(this.color);
		this.Draw.drawRect(offset.x, offset.y, this.width, this.height, true);
	}
}
