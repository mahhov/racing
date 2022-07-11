import * as THREE from 'three';

class SmoothCamera {
	#camera;
	#followPosition = null;

	constructor(camera) {
		this.#camera = camera;
	}

	reset() {
		this.#followPosition = null;
	}

	follow(position) {
		const WEIGHT = .7;
		const DISTANCE = 15;
		const HEIGHT = 15;

		if (!this.#followPosition) {
			this.#followPosition = position;
			this.#camera.position.copy(position);
		} else
			this.#followPosition.multiplyScalar(WEIGHT).addScaledVector(position, 1 - WEIGHT);

		let delta = this.#followPosition.clone().sub(this.#camera.position);
		delta.y = 0;
		if (!delta.length())
			delta = new THREE.Vector3(0, 0, 1);
		delta.setLength(DISTANCE);
		this.#camera.position.copy(this.#followPosition.clone().sub(delta));
		this.#camera.position.y += HEIGHT;
		this.#camera.lookAt(position);
	}
}

export default SmoothCamera;
