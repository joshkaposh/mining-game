import World from "./world/World.js";
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let anId;

let world;
let tilesize = 64;
let cols = 10;
let rows = 10;

let width = tilesize * cols;
let height = tilesize * rows;

function animate() {
	time.getTime();
	c.imageSmoothingEnabled = false;

	c.clearRect(0, 0, width, height);
	c.fillStyle = "white";
	c.strokeStyle = "white";

	world.update();

	anId = requestAnimationFrame(animate);
}

function init() {
	canvas.width = width;
	canvas.height = height;
	world = new World(c, width, height, cols, rows, tilesize);
	world.init();

	animate();
}

init();
