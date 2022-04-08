export const offsetToCenter = (pos, cameraPos, canvasW, canvasH, cameraW, cameraH) => {
	return new Vect2(
		Math.ceil(pos.x - cameraPos.x + canvasW * 0.5 - cameraW * 0.5),
		Math.ceil(pos.y - cameraPos.y + canvasH * 0.5 - cameraH * 0.5)
	);
};

export default class Camera {
	constructor(x, y, width, height, { tilesize, cols, rows }) {
		this.pos = new Vect2(x, y);
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		this.cols = cols;
		this.rows = rows;
		this.scrollSpeed = tilesize;
		this.xMin = 0;
		this.yMin = 0;
		this.xMax = cols;
		this.yMax = rows;
		this.maxX = cols * tilesize;
		this.maxY = rows * tilesize;
		this.following = null;
	}

	draw(Drawer) {
		Drawer.setStroke("black");
		Drawer.drawRect(this.pos.x, this.pos.y, this.width, this.height, false);
	}

	getDimensions() {
		return {
			xMin: Math.floor(this.pos.x / this.tilesize),
			xMax: Math.ceil((this.pos.x + this.width) / this.tilesize),
			yMin: Math.floor(this.pos.y / this.tilesize),
			yMax: Math.ceil((this.pos.y + this.height) / this.tilesize),
		};
	}

	follow(entity) {
		this.following = entity;
		entity.screenX = 0;
		entity.screenY = 0;
	}

	// follow(player) {
	// 	this.pos.x = Math.round(player.pos.x - this.width / 2 + player.width / 2);
	// 	this.pos.y = Math.round(player.pos.y - this.height / 2 + player.height / 2);

	// 	let { xMin, yMin, xMax, yMax } = this.getDimensions();

	// 	if (yMin < this.yMin) this.pos.y = this.yMin;
	// 	if (xMin < this.xMin) this.pos.x = this.xMin;
	// 	if (xMax > this.xMax) this.pos.x = this.cols * this.tilesize - this.width;
	// 	if (yMax > this.yMax) this.pos.y = this.rows * this.tilesize - this.height;

	// 	return {
	// 		xMin,
	// 		xMax,
	// 		yMin,
	// 		yMax,
	// 	};
	// }

	update() {
		// assume followed sprite should be placed in middle if possible
		this.following.screenX = this.width / 2;
		this.following.screenY = this.height / 2;

		// make camera follow sprite
		this.pos.x = this.following.pos.x - this.width / 2;
		this.pos.y = this.following.pos.y - this.height / 2;
		// clamp
		this.pos.x = Math.max(0, Math.min(this.pos.x, this.maxX - this.width));
		this.pos.y = Math.max(0, Math.min(this.pos.y, this.maxY - this.height));

		// console.log(Math.max(0, Math.min(this.pos.y, this.maxY)));

		// console.log(this.pos.x / this.tilesize);
		// console.log(Math.ceil((this.pos.y + this.height) / this.tilesize));

		// in map corners, the sprite cannot be placed in the center of the screen
		// and we have to change its screen coordinates

		// left and right sides
		if (this.following.pos.x < this.width / 2 || this.following.pos.x > this.maxX + this.width / 2) {
			this.following.screenX = this.following.pos.x - this.pos.x;
		}
		// top and bottom sides

		// console.log("top: ", this.following.pos.y < this.height / 2);
		// ! test for bottom
		if (this.following.pos.y > this.maxY) {
			console.log("bottom: ", this.following.pos.y > this.maxY);
			console.log(this.pos.x);
		}

		if (this.following.pos.y < this.height / 2 || this.following.pos.y > this.maxY + this.height / 2) {
			this.following.screenY = this.following.pos.y - this.pos.y;
		}
	}
}
