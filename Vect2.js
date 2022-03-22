class Vect2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vect) {
		this.x += vect.x;
		this.y += vect.y;
	}
	sub(vect) {
		this.x -= vect.x;
		this.y -= vect.y;
	}
	set(vect) {
		this.x = vect.x;
		this.y = vect.y;
	}

	addX(vect) {
		this.x += vect.x;
	}

	addY(vect) {
		this.y += vect.y;
	}

	subX(vect) {
		this.x -= vect.x;
	}
	subY(vect) {
		this.y -= vect.y;
	}

	setX(vect) {
		this.x = vect.x;
	}
	setY(vect) {
		this.y = vect.y;
	}

	clone() {
		return new Vect2(this.x, this.y);
	}
}
