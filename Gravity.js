/*

update(pos,playerHeight, tile) {
	if(pos.y + playerHeight > tile.x) {
		this.velocity = -this.velocity;
	} else {
		this.velocity += this.acceleration;
	}
	pos.y += this.velocity
}

*/

export default class Gravity {
	constructor(velocity, acceleration) {
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.initialAcc = acceleration;
		this.initialVel = velocity;
	}

	calculateNewPosition(pos) {
		let new_pos = new Vect2(pos.x, lerp(pos.y, pos.y + this.velocity, time.delta));
		return new_pos;
	}

	inc() {
		this.velocity += this.acceleration;
	}

	reset() {
		this.velocity = this.initialVel;
		this.acceleration = this.initialAcc;
	}
}
