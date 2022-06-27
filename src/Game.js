import Car from './Car.js';
import FixedCamera from './FixedCamera.js';
import SmoothCamera from './SmoothCamera.js';
import Track from './Track.js';

class Game {
	#playerCar;
	#track;
	#camera;
	#particles = [];

	constructor(scene, camera) {
		this.#playerCar = new Car();
		scene.add(this.#playerCar.mesh);
		this.#track = new Track();
		scene.add(this.#track.mesh);
		this.#camera = new FixedCamera(camera);
	}

	addParticle(particle) {
		this.#particles.push(particle);
	}

	update(scene, input) {
		this.#playerCar.update(this, input);
		this.#particles = this.#particles.filter(particle => {
			if (particle.update())
				scene.remove(particle.mesh);
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
