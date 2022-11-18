import * as THREE from 'three';
import Car from '../car/Car.js';
import CAR_INFOS from '../car/CarInfo.js';
import Input from '../Input.js';
import IntersectionManager from '../IntersectionManager.js';
import LapManager from '../LapManager.js';
import SmoothCamera from '../SmoothCamera.js';
import UiComponent from '../ui/UiComponent.js';

class GameFrame extends UiComponent {
	#scene;
	#camera;
	#directionalLight;

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

	reset(track, carParams) {
		this.#scene.clear();

		this.#directionalLight = new THREE.DirectionalLight(0xffffff, .4);
		this.#directionalLight.castShadow = true;
		this.#directionalLight.shadow.mapSize.set(4096, 4096);
		this.#directionalLight.shadow.camera.left = -320;
		this.#directionalLight.shadow.camera.right = 320;
		this.#directionalLight.shadow.camera.top = 320;
		this.#directionalLight.shadow.camera.bottom = -320;
		this.#directionalLight.shadow.camera.near = 10;
		this.#directionalLight.shadow.camera.far = 600;
		this.#scene.add(this.#directionalLight);
		this.#scene.add(this.#directionalLight.target);

		let ambientLight = new THREE.AmbientLight(0xffffff, .4);
		this.#scene.add(ambientLight);

		this.#camera.reset();

		this.#track = track;
		this.#intersectionManager = new IntersectionManager(this.#track);
		this.#scene.add(this.#track.mesh);
		this.#playerCar = new Car(this, this.#track, this.#intersectionManager, new LapManager(1), this.input,
			carParams, this.#track.startPosition.clone(), this.#track.startDirection.clone());
		this.#scene.add(this.#playerCar.mesh);
		this.#opponentCar = new Car(this, this.#track, this.#intersectionManager, new LapManager(1), null,
			CAR_INFOS[1].carParams, this.#track.startPosition.clone(), this.#track.startDirection.clone());
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
		if (this.input.getKey('p') === Input.states.PRESSED || this.input.getKey('escape') === Input.states.PRESSED)
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
		this.#directionalLight.position.copy(this.#playerCar.position).setComponent(1, 500);
		this.#directionalLight.target.position.copy(this.#playerCar.position).setComponent(1, 0).add(new THREE.Vector3(50, 0, 30));
	}

	paintUi(uiTexture) {
		this.#entities.forEach(entity => entity.paintUi(uiTexture));
	}
}

export default GameFrame;
