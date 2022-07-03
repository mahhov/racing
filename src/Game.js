import Car from './Car.js';
import FixedCamera from './FixedCamera.js';
import IntersectionManager from './IntersectionManager.js';
import SmoothCamera from './SmoothCamera.js';
import Track from './Track.js';

const fixedCamera = false;

class Game {
	#scene;
	#track;
	#playerCar;
	#camera;
	#intersectionManager;
	#particles = [];

	constructor(scene, camera, fixedCamera) {
		this.#scene = scene;
		this.#track = Track.trackSquare();
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this.#track.startPosition);
		this.#scene.add(this.#playerCar.mesh);
		this.#intersectionManager = new IntersectionManager(this.#track);
		this.#camera = fixedCamera ? new FixedCamera(camera) : new SmoothCamera(camera);
	}

	addParticle(particle) {
		this.#particles.push(particle);
		this.#scene.add(particle.mesh);
	}

	update(input) {
		this.#playerCar.update(this, this.#intersectionManager, input);
		this.#particles = this.#particles.filter(particle => {
			if (particle.update())
				this.#scene.remove(particle.mesh);
			else
				return true;
		});
	}

	paint() {
		this.#playerCar.paint();
		this.#track.paint();
		this.#particles.forEach(particle => particle.paint());
		this.#camera.follow(this.#playerCar.position);
	}
}

export default Game;
