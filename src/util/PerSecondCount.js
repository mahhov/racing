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
		this.#text = this.addUiComponent(new UiText('', .05, .05 + .03 * line, 'left', 'bottom', '#fff'));
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

	paintUi(uiTexture) {
		super.paintUi(uiTexture);
	}
}

export default PerSecondCount;
