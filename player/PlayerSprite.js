import Sprite from "../sprites/Sprite.js";
const player_spritesheet = document.getElementById("player_spritesheet");

// ! frames start at 0
export const maxFrames = {
	IDLE: 3,
	WALKING: 7,
};

export default class PlayerSprite extends Sprite {
	constructor(playerWidth, playerHeight, spriteWidth, spriteHeight, frameX, frameY) {
		super(player_spritesheet, spriteWidth, spriteHeight, 1, frameX, frameY);
		this.playerWidth = Math.floor(playerWidth);
		this.playerHeight = Math.floor(playerHeight);
	}

	draw(Draw, offset) {
		Draw.drawImage(
			player_spritesheet,
			this.frameX, // sX
			this.frameY, // sY
			this.spriteWidth, // sW
			this.spriteHeight, // sH
			offset.x - this.playerWidth, // dX
			offset.y, // dY
			this.playerWidth * 3, // dW
			this.playerHeight // dH
		);
	}
}
