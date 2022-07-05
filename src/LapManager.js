import GameEntity from './GameEntity.js';
import UiText from './ui/UiText.js';

class LapManager extends GameEntity {
	#maxLap;
	#lap = 0;
	#ticks = 0;

	#lapText = new UiText('', .95, .05, 'right', '#fff', '20px arial');
	#timeText = new UiText('', .95, .08, 'right', '#fff', '20px arial');

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
		this.#lapText.text = `${this.#lap + 1} / ${this.#maxLap}`;
		let seconds = Math.floor(this.#ticks / 20);
		let minutes = Math.floor(seconds / 60);
		this.#timeText.text = `${minutes}:${seconds % 60}`;

		this.#lapText.paintUi(ctx, width, height);
		this.#timeText.paintUi(ctx, width, height);
	}
}

export default LapManager;
