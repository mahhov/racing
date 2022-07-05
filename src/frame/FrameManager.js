import GameEntity from '../GameEntity.js';
import GameFrame from './GameFrame.js';
import PauseFrame from './PauseFrame.js';
import TrackFrame from './TrackFrame.js';

class FrameManager extends GameEntity {
	#trackFrame;
	#gameFrame;
	#pauseFrame;
	#activeFrame;

	constructor(input, scene, camera, fixedCamera) {
		super();
		this.#trackFrame = new TrackFrame(input);
		this.#gameFrame = new GameFrame(input, scene, camera, fixedCamera);
		this.#pauseFrame = new PauseFrame(input, this.#gameFrame);

		this.#activeFrame = this.#trackFrame;

		this.#gameFrame.addListener('pause', () => this.#activeFrame = this.#pauseFrame);
		this.#pauseFrame.addListener('resume', () => this.#activeFrame = this.#gameFrame);
		this.#pauseFrame.addListener('abandon', () => this.#activeFrame = this.#trackFrame);
		this.#trackFrame.addListener('select', i => this.#activeFrame = this.#gameFrame);
	}

	get uiOnly() {
		return this.#activeFrame !== this.#pauseFrame && this.#activeFrame !== this.#gameFrame;
	}

	update() {
		this.#activeFrame.update();
	}

	paint() {
		this.#activeFrame.paint();
	}

	paintUi(ctx, width, height) {
		this.#activeFrame.paintUi(ctx, width, height);
	}
}

export default FrameManager;
