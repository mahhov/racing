import FrameManager from './frame/FrameManager.js';
import Input from './Input.js';
import Render from './Render.js';
import PerSecondCount from './util/PerSecondCount.js';
import {sleep} from './util/util.js';

class Loop {
	#render = new Render(800, 800);
	#input = new Input(this.#render.canvas);
	#frameManager = new FrameManager(this.#input, this.#render.scene, this.#render.camera);
	#paintDirty = false;
	#updatesPerSecond = new PerSecondCount(0, 'UPS');
	#paintsPerSecond = new PerSecondCount(1, 'FPS');

	constructor() {
		this.#updateLoop();
		this.#paintLoop();
	}

	async #updateLoop() {
		let lastUpdate = 0;
		while (true) {
			await sleep(0);
			let now = performance.now();
			if (now - lastUpdate > 1000 / 60) {
				lastUpdate = now;
				this.#frameManager.update();
				this.#paintDirty = true;
				this.#updatesPerSecond.add();
				this.#input.update();
			}
		}
	}

	#paintLoop() {
		if (this.#paintDirty) {
			this.#paintsPerSecond.add();
			this.#paintDirty = false;
			this.#frameManager.paintUi(this.#render.uiTexture);
			this.#updatesPerSecond.paintUi(this.#render.uiTexture);
			this.#paintsPerSecond.paintUi(this.#render.uiTexture);
			this.#render.render(this.#frameManager.uiOnly);
		}
		requestAnimationFrame(() => this.#paintLoop());
	}
}

export default Loop;
