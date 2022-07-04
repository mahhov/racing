import GameEntity from './GameEntity.js';

class LapManager extends GameEntity {
	#maxLap;
	#lap = 0;
	#ticks = 0;

	constructor(maxLap) {
		super();
		this.#maxLap = maxLap;
	}

	addLap(delta) {
		this.#lap += delta;
	}

	update() {
		this.#ticks++;
	}

	paintUi(ctx, width, height) {
		ctx.fillStyle = '#fff';
		ctx.font = '20px arial';
		ctx.fillText(`${this.#lap + 1} / ${this.#maxLap}`, width - 130, 30);
		let seconds = Math.floor(this.#ticks / 20);
		let minutes = Math.floor(seconds / 60);
		ctx.fillText(`${minutes}:${seconds % 60}`, width - 130, 60);
	}
}

export default LapManager;
