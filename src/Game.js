import Car from './Car.js';
import FixedCamera from './FixedCamera.js';
import SmoothCamera from './SmoothCamera.js';
import Track from './Track.js';

class Game {
	#scene;
	#track;
	#playerCar;
	#camera;
	#particles = [];

	constructor(scene, camera, fixedCamera) {
		this.#scene = scene;
		this.#track = Track.Track1();
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this.#track.startPosition);
		this.#scene.add(this.#playerCar.mesh);
		this.#camera = fixedCamera ? new FixedCamera(camera) : new SmoothCamera(camera);
	}

	addParticle(particle) {
		this.#particles.push(particle);
		this.#scene.add(particle.mesh);
	}

	update(input) {
		this.#playerCar.update(this, input);
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
