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

		this.#activeFrame = this.#gameFrame;

		this.#gameFrame.addListener('pause', () => this.#activeFrame = this.#pauseFrame);
		this.#pauseFrame.addListener('resume', () => this.#activeFrame = this.#gameFrame);
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
