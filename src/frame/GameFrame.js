import * as THREE from 'three';
import Car from '../car/Car.js';
import Input from '../Input.js';
import IntersectionManager from '../IntersectionManager.js';
import LapManager from '../LapManager.js';
import SmoothCamera from '../SmoothCamera.js';
import UiComponent from '../ui/UiComponent.js';

class GameFrame extends UiComponent {
	#scene;
	#camera;

	#track;
	#playerCar;
	#opponentCar;
	#intersectionManager;
	#done;

	#entities;
	#addedEntities;

	constructor(input, scene, camera) {
		super(input);
		this.#scene = scene;
		this.#camera = new SmoothCamera(camera);
	}

	reset(track) {
		this.#scene.clear();
		let light1 = new THREE.PointLight(0xffffff, 1, 0);
		light1.position.set(0, 30, 0);
		this.#scene.add(light1);
		let ambientLight = new THREE.AmbientLight(0xAAAAAA);
		this.#scene.add(ambientLight);
		this.#camera.reset();

		this.#track = track;
		this.#intersectionManager = new IntersectionManager(this.#track);
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this, this.#track, this.#intersectionManager, new LapManager(1), this.input, this.#track.startPosition.clone());
		this.#scene.add(this.#playerCar.mesh);
		this.#opponentCar = new Car(this, this.#track, this.#intersectionManager, new LapManager(1), null, this.#track.startPosition.clone());
		this.#scene.add(this.#opponentCar.mesh);

		this.#done = false;
		this.#entities = [];
		this.#addedEntities = [];
		this.#entities.push(this.#playerCar);
		this.#entities.push(this.#opponentCar);
	}

	addEntity(particle) {
		if (this.#entities.length + this.#addedEntities.length > 1500)
			return;
		this.#addedEntities.push(particle);
		this.#scene.add(particle.mesh);
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('pause');

		if (!this.#done && (this.#playerCar.done || this.#opponentCar.done)) {
			this.#done = true;
			if (this.#playerCar.done)
				this.emit('end', true);
			else
				this.emit('end', false);
		}

		this.#entities = this.#entities.filter(entity => {
			if (!entity.update())
				return true;
			else if (entity.mesh)
				this.#scene.remove(entity.mesh);
		}).concat(this.#addedEntities);
		this.#addedEntities = [];

		this.#camera.follow(this.#playerCar.position);
	}

	paintUi(ctx, width, height) {
		this.#entities.forEach(entity => entity.paintUi(ctx, width, height));
	}
}

export default GameFrame;
