import GameEntity from './GameEntity.js';
import UiText from './ui/UiText.js';

class LapManager extends GameEntity {
	maxLap;
	lap = 0;
	#ticks = 0;

	#lapText;
	#timeText;

	constructor(maxLap) {
		super();
		this.maxLap = maxLap;
		this.#lapText = this.addUiComponent(new UiText('', .95, .05, 'right', 'bottom', '#fff'));
		this.#timeText = this.addUiComponent(new UiText('', .95, .08, 'right', 'bottom', '#fff'));
	}

	addLap(delta) {
		this.lap += delta;
	}

	update() {
		super.update();
		this.#ticks++;
	}

	paintUi(uiTexture) {
		this.#lapText.text = `${this.lap + 1} / ${this.maxLap}`;
		let seconds = Math.floor(this.#ticks / 20);
		let minutes = Math.floor(seconds / 60);
		this.#timeText.text = `${minutes}:${seconds % 60}`;

		super.paintUi(uiTexture);
	}
}

export default LapManager;
