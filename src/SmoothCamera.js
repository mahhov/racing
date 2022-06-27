import * as THREE from 'three';

class SmoothCamera {
	#camera;

	constructor(camera) {
		this.#camera = camera;
	}

	follow(position) {
		const DISTANCE = 25;
		const HEIGHT = 15;

		let delta = position.clone().sub(this.#camera.position);
		delta.y = 0;
		if (!delta.length())
			delta = new THREE.Vector3(0, 0, 1);
		delta.setLength(DISTANCE);
		delta.y = position.y - HEIGHT;
		this.#camera.position.copy(position.clone().sub(delta));
		this.#camera.lookAt(position);
	}
}

export default SmoothCamera;
