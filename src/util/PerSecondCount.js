import GameEntity from '../GameEntity.js';
import UiText from '../ui/UiText.js';

class PerSecondCount extends GameEntity {
	#prefixText;
	#start = 0;
	#count = 0;

	#text;

	constructor(line, prefixText) {
		super();
		this.#prefixText = prefixText;
		this.#text = new UiText('', .05, .05 + .03 * line, 'left', '#fff', '20px arial');
	}

	add() {
		this.#count++;

		let now = performance.now();
		if (this.elapsedSecond(now)) {
			this.#text.text = `${this.#prefixText} ${this.#count}`;
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
		this.#text.paintUi(ctx, width, height);
	}
}

export default PerSecondCount;
