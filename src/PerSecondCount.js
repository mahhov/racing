import GameEntity from './GameEntity.js';

class PerSecondCount extends GameEntity {
	#position;
	#prefixText;
	#start = 0;
	#count = 0;
	#text;

	constructor(position, prefixText) {
		super();
		this.#position = position;
		this.#prefixText = prefixText;
	}

	add() {
		this.#count++;

		let now = Date.now();
		if (this.elapsedSecond(now)) {
			this.#text = `${this.#prefixText} ${this.#count}`;
			this.reset(now);
		}
	}

	elapsedSecond(now) {
		return now - this.#start > 1000;
	}

	reset(now) {
		this.#count = 0;
		this.#start = now;
	}

	paintUi(ctx, width, height) {
		ctx.fillStyle = '#fff';
		ctx.font = '20px arial';
		ctx.fillText(this.#text, this.#position.x, this.#position.y);
	}
}

export default PerSecondCount;
