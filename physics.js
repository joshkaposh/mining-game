export const centerOfBox = (pos, width, height) => {
	return new Vect2(pos.x + width * 0.5, pos.y + height * 0.5);
};

export const boxTileCollision = (box, tile) => {
	if (
		box.pos.x + box.width >= tile.x &&
		box.pos.x <= tile.x + tile.tilesize &&
		box.pos.y + box.height >= tile.y &&
		box.pos.y <= tile.y + tile.tilesize &&
		!tile.walkable
	) {
		return true; // collided and tile is not walkable
	}
	return false;
};

export const boxCollision = (boxA, boxB) => {
	if (
		boxA.pos.x + boxA.width >= boxB.pos.x &&
		boxA.pos.x <= boxB.pos.x + boxB.width &&
		boxA.pos.y + boxA.height >= boxB.pos.y &&
		boxA.pos.y <= boxB.pos.y + boxB.height
	) {
		return true;
	}
	return false;
};
