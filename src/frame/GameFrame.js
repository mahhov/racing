import Car from '../car/Car.js';
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

	#entities = [];
	#addedEntities = [];

	constructor(input, scene, camera, fixedCamera) {
		super(input);
		this.#scene = scene;
		this.#track = Track.trackSquare();
		this.#intersectionManager = new IntersectionManager(this.#track);
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this, this.#intersectionManager, new LapManager(2), this.input, this.#track.startPosition.clone());
		this.#scene.add(this.#playerCar.mesh);
		this.#opponentCar = new Car(this, this.#intersectionManager, new LapManager(2), null, this.#track.startPosition.clone());
		this.#scene.add(this.#opponentCar.mesh);
		this.#camera = fixedCamera ? new FixedCamera(camera) : new SmoothCamera(camera);

		this.#entities.push(this.#playerCar);
		this.#entities.push(this.#opponentCar);
	}

	addEntity(particle) {
		this.#addedEntities.push(particle);
		this.#scene.add(particle.mesh);
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('pause');

		this.#entities = this.#entities.filter(entity => {
			if (!entity.update())
				return true;
			else if (entity.mesh)
				this.#scene.remove(entity.mesh);
		}).concat(this.#addedEntities);
		this.#addedEntities = [];
	}

	paint() {
		this.#entities.forEach(entity => entity.paint());
		this.#track.paint();
		this.#camera.follow(this.#playerCar.position);
	}

	paintUi(ctx, width, height) {
		this.#entities.forEach(entity => entity.paintUi(ctx, width, height));
	}
}

export default GameFrame;
