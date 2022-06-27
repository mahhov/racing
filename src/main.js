import * as THREE from 'three';
import Input from './Input.js';
import Game from './Game.js';
import PerSecondCount from './PerSecondCount.js';

window.THREE = THREE;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 800);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const light1 = new THREE.PointLight(0xffffff, 1, 0);
light1.position.set(0, 30, 0);
scene.add(light1);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const sleep = ms => new Promise(r => setTimeout(r, ms));

class Loop {
	#game = new Game(scene, camera, false);
	#input = new Input();
	#paintDirty = false;

	constructor() {
		this.#updateLoop();
		this.#paintLoop();
	}

	async #updateLoop() {
		let updatesPerSecond = new PerSecondCount();
		let lastUpdate = 0;
		while (true) {
			await sleep(0);
			let now = Date.now();
			if (now - lastUpdate > 1000 / 60) {
				lastUpdate = now;
				this.#game.update(this.#input);
				this.#paintDirty = true;
				updatesPerSecond.add();
			}
			updatesPerSecond.log('Updates');
		}
	}

	#paintLoop() {
		let paintsPerSecond = new PerSecondCount();
		let loop = () => {
			if (this.#paintDirty) {
				this.#game.paint(camera);
				renderer.render(scene, camera);
				this.#paintDirty = false;
				paintsPerSecond.add();
				paintsPerSecond.log('Paints');
			}
			requestAnimationFrame(loop);
		};
		loop();
	}
}


new Loop();
