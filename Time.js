class Time {
	constructor() {
		this.delta = null;
		this.totalDelta = null;
		this.lastFrameTime = null;
	}
	getTime() {
		if (!this.lastFrameTime) {
			this.lastFrameTime = performance.now();
			this.totalDelta = 0;
			return;
		}

		this.delta = (performance.now() - this.lastFrameTime) / 1000;
		this.lastFrameTime = performance.now();
		this.totalDelta += this.delta;
	}
}

const time = new Time();
