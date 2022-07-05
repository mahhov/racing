import GameEntity from '../GameEntity.js';
import EndFrame from './EndFrame.js';
import GameFrame from './GameFrame.js';
import PauseFrame from './PauseFrame.js';
import TrackFrame from './TrackFrame.js';

class FrameManager extends GameEntity {
	#trackFrame;
	#gameFrame;
	#pauseFrame;
	#endFrame;
	#activeFrame;

	constructor(input, scene, camera, fixedCamera) {
		super();
		this.#trackFrame = new TrackFrame(input);
		this.#gameFrame = new GameFrame(input, scene, camera, fixedCamera);
		this.#pauseFrame = new PauseFrame(input, this.#gameFrame);
		this.#endFrame = new EndFrame(input, this.#gameFrame);

		this.#activeFrame = this.#trackFrame;

		this.#gameFrame.addListener('pause', () => this.#activeFrame = this.#pauseFrame);
		this.#gameFrame.addListener('end', win => {
			this.#endFrame.setEnd(win);
			this.#activeFrame = this.#endFrame;
		});
		this.#pauseFrame.addListener('resume', () => this.#activeFrame = this.#gameFrame);
		this.#pauseFrame.addListener('abandon', () => this.#activeFrame = this.#trackFrame);
		this.#endFrame.addListener('back', () => this.#activeFrame = this.#trackFrame);
		this.#trackFrame.addListener('select', track => {
			this.#gameFrame.reset(track);
			this.#activeFrame = this.#gameFrame;
		});
	}

	get uiOnly() {
		return ![this.#gameFrame, this.#pauseFrame, this.#endFrame].includes(this.#activeFrame);
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
