import * as THREE from 'three';

class FixedCamera {
	#camera;

	constructor(camera) {
		this.#camera = camera;
	}

	follow(position) {
		this.#camera.position.copy(position.clone().add(new THREE.Vector3(0, 15, 15)));
		this.#camera.lookAt(position);
	}
}

export default FixedCamera;
