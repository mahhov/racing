import Car from '../Car.js';
import FixedCamera from '../FixedCamera.js';
import Input from '../Input.js';
import IntersectionManager from '../IntersectionManager.js';
import LapManager from '../LapManager.js';
import SmoothCamera from '../SmoothCamera.js';
import Track from '../Track.js';
import Frame from './Frame.js';

class GameFrame extends Frame {
	#scene;
	#track;
	#playerCar;
	#opponentCar;
	#intersectionManager;
	#camera;
	#lapManager;
	#particles = [];

	constructor(input, scene, camera, fixedCamera) {
		super(input);
		this.#scene = scene;
		this.#track = Track.trackSquare();
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this.#track.startPosition.clone());
		this.#scene.add(this.#playerCar.mesh);
		this.#opponentCar = new Car(this.#track.startPosition.clone());
		this.#scene.add(this.#opponentCar.mesh);
		this.#intersectionManager = new IntersectionManager(this.#track);
		this.#camera = fixedCamera ? new FixedCamera(camera) : new SmoothCamera(camera);
		this.#lapManager = new LapManager(2);
	}

	addParticle(particle) {
		this.#particles.push(particle);
		this.#scene.add(particle.mesh);
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('pause');

		this.#playerCar.updatePlayer(this, this.#intersectionManager, this.#lapManager, this.input);
		this.#opponentCar.updateAi(this, this.#intersectionManager, this.#lapManager);
		this.#particles = this.#particles.filter(particle => {
			if (particle.update())
				this.#scene.remove(particle.mesh);
			else
				return true;
		});
		this.#lapManager.update();
	}

	paint() {
		this.#playerCar.paint();
		this.#opponentCar.paint();
		this.#track.paint();
		this.#particles.forEach(particle => particle.paint());
		this.#camera.follow(this.#playerCar.position);
	}

	paintUi(ctx, width, height) {
		this.#lapManager.paintUi(ctx, width, height);
	}
}

export default GameFrame;
