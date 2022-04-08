const tile_spritesheet = document.getElementById("tile_spritesheet");

class Sprite {
	constructor(spritesheet, spriteWidth, spriteHeight, scale, frameX, frameY) {
		this.spritesheet = spritesheet;
		this.spriteWidth = spriteWidth;
		this.spriteHeight = spriteHeight;
		this.scale = scale;
		this.frameX = frameX;
		this.frameY = frameY;
	}
	drawSprite(
		Draw,
		offset,
		spritesheet = this.spritesheet,
		frameX = this.frameX,
		frameY = this.frameY,
		spriteWidth = this.spriteWidth,
		spriteHeight = this.spriteHeight,
		scale = this.scale
	) {
		// img, sx, sy, sW, sH, dx, dy, dW, dH
		Draw.drawImage(
			spritesheet,
			frameX * spriteWidth, // sx
			frameY * spriteHeight, // sy
			spriteWidth, // sW
			spriteHeight, //sH
			offset.x, // dx
			offset.y, // dy
			spriteWidth * scale, // dW
			spriteHeight * scale // dH
		);
	}
}

export class TileSprite extends Sprite {
	constructor(tileWidth, tileHeight, scale, frameX, frameY) {
		super(tile_spritesheet, tileWidth, tileHeight, scale, frameX, frameY);
	}
}

export default Sprite;
