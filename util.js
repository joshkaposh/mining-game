const lerp = (x, target, amount) => {
	return x + (target - x) * amount;
};

const randIntFromRange = (min, max) => Math.floor(Math.random() * (max - min) + min);
// exclusive ---> if max = 10, largest int is 9

const pointRect = (point, { rectX, rectY, rectWidth, rectHeight }) => {
	// check if point is greater than rect left side;
	// check if point is less than rect right side;
	// same for top/bottom;

	if (point.x >= rectX && point.x <= rectX + rectWidth && point.y >= rectY && point.y <= rectY + rectHeight) {
		return true;
	}
	return false;
};
