import World from "./world/World.js";
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let anId;

let world, camera;
let tilesize = 64;
let cols = 20;
let rows = 40;

let width = tilesize * cols;
let height = tilesize * rows;

window.addEventListener("resize", resize);

let aspectRatio = 16 / 9;
let deviceWidth = window.innerWidth;
let deviceHeight = window.innerHeight;

function calculateScreenSize() {
	deviceWidth = window.innerWidth;
	deviceHeight = window.innerHeight;

	if (deviceHeight < deviceWidth / aspectRatio) deviceWidth = deviceHeight * aspectRatio;
	else deviceHeight = deviceWidth / aspectRatio;
}

function resize() {
	// ! little bit of resizing issues on lower width devices
	calculateScreenSize();

	canvas.width = deviceWidth;
	canvas.height = deviceHeight;

	canvas.style.width = deviceWidth + "px";
	canvas.style.height = deviceHeight + "px";
	world.camera.width = deviceWidth;
	world.camera.height = deviceHeight;

	c.imageSmoothingEnabled = false;
}

function animate() {
	time.getTime();
	c.imageSmoothingEnabled = false;

	c.clearRect(0, 0, width, height);
	c.fillStyle = "white";
	c.strokeStyle = "white";

	world.update(camera);
	world.render();

	anId = requestAnimationFrame(animate);
}

function init() {
	calculateScreenSize();

	// canvas.width = width;
	// canvas.height = height;
	console.log(deviceWidth, deviceHeight);

	world = new World(c, width, height, cols, rows, tilesize);

	world.init(deviceWidth, deviceHeight);

	resize();
	animate();
}

init();
