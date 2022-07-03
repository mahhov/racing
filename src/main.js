import * as THREE from 'three';
import Game from './Game.js';
import Input from './Input.js';
import PerSecondCount from './PerSecondCount.js';
import Render from './Render.js';

let render = new Render(800, 800);

let sleep = ms => new Promise(r => setTimeout(r, ms));

class Loop {
	#input = new Input();
	#game = new Game(this.#input, render.scene, render.camera, false);
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
				this.#game.paintUi(render.uiTexture.ctx, render.width, render.height);
				this.#updatesPerSecond.paintUi(render.uiTexture.ctx, render.width, render.height);
				this.#paintsPerSecond.paintUi(render.uiTexture.ctx, render.width, render.height);
				render.render();
			}
			requestAnimationFrame(loop);
		};
		loop();
	}
}


new Loop();
