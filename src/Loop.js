import * as THREE from 'three';
import Game from './Game.js';
import Input from './Input.js';
import PerSecondCount from './PerSecondCount.js';
import Render from './Render.js';
import {sleep} from './util.js';

class Loop {
	#render = new Render(800, 800);
	#input = new Input();
	#game = new Game(this.#input, this.#render.scene, this.#render.camera, false);
	#paintDirty = false;
	#updatesPerSecond = new PerSecondCount(new THREE.Vector2(10, 30), 'UPS');
	#paintsPerSecond = new PerSecondCount(new THREE.Vector2(10, 50), 'FPS');

	constructor() {
		this.#updateLoop();
		this.#paintLoop();
	}

	async #updateLoop() {
		let lastUpdate = 0;
		while (true) {
			await sleep(0);
			let now = Date.now();
			if (now - lastUpdate > 1000 / 60) {
				lastUpdate = now;
				this.#game.update();
				this.#paintDirty = true;
				this.#updatesPerSecond.add();
			}
		}
	}

	#paintLoop() {
		let loop = () => {
			if (this.#paintDirty) {
				this.#paintsPerSecond.add();
				this.#paintDirty = false;
				this.#game.paint();
				this.#game.paintUi(this.#render.uiTexture.ctx, this.#render.width, this.#render.height);
				this.#updatesPerSecond.paintUi(this.#render.uiTexture.ctx, this.#render.width, this.#render.height);
				this.#paintsPerSecond.paintUi(this.#render.uiTexture.ctx, this.#render.width, this.#render.height);
				this.#render.render();
			}
			requestAnimationFrame(loop);
		};
		loop();
	}
}

export default Loop;
