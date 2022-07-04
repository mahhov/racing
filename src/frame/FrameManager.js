import UiEntity from '../UiEntity.js';
import GameFrame from './GameFrame.js';
import PauseFrame from './PauseFrame.js';

class FrameManager extends UiEntity {
	#gameFrame;
	#pauseFrame;
	#paused = false;

	constructor(input, scene, camera, fixedCamera) {
		super();
		this.#gameFrame = new GameFrame(input, scene, camera, fixedCamera);
		this.#pauseFrame = new PauseFrame(input);

		this.#gameFrame.addListener('pause', () => this.#paused = true);
		this.#pauseFrame.addListener('resume', () => this.#paused = false);
	}

	update() {
		if (!this.#paused)
			this.#gameFrame.update();
		else
			this.#pauseFrame.update();
	}

	paint() {
		this.#gameFrame.paint();
	}

	paintUi(ctx, width, height) {
		this.#gameFrame.paintUi(ctx, width, height);
		if (this.#paused)
			this.#pauseFrame.paintUi(ctx, width, height);
	}
}

export default FrameManager;
