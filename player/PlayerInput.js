export default class PlayerInput {
	constructor() {
		this.keys = {};
		this.lastKey = null;
		window.addEventListener("keydown", (e) => {
			this.keys[e.code] = true;
		});

		window.addEventListener("keyup", (e) => {
			this.keys[e.code] = false;

			// if (!this.keys["KeyW"]) {
			// 	this.state.isFlying = false;
			// }
			// if (!this.keys["KeyA"]) {
			// 	this.state.isMoving = false;
			// }
			// if (!this.keys["KeyS"]) {
			// 	this.state.isMoving = false;
			// 	this.moveDown();
			// }
			// if (!this.keys["KeyD"]) {
			// 	this.state.isMoving = false;
			// 	this.moveRight();
			// }
		});
	}
}
