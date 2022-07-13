import * as THREE from 'three';

class DynamicTexture {
	#canvas;
	#ctx;
	#texture;

	constructor(width, height) {
		this.#canvas = new OffscreenCanvas(width, height);
		this.#ctx = this.#canvas.getContext('2d');
		this.#texture = new THREE.Texture(this.#canvas);
		this.#texture.magFilter = THREE.NearestFilter;
		this.#texture.minFilter = THREE.NearestFilter;
	}

	get ctx() {
		this.#texture.needsUpdate = true;
		return this.#ctx;
	}

	get canvas() {
		return this.#canvas;
	}

	get phongMaterial() {
		return new THREE.MeshPhongMaterial({
			shininess: 0,
			map: this.#texture,
		});
	}

	get spriteMaterial() {
		return new THREE.SpriteMaterial({
			map: this.#texture,
		});
	}

	get uiMaterial() {
		return new THREE.MeshBasicMaterial({
			map: this.#texture,
			transparent: true,
		});
	}

	get skyMaterial() {
		return new THREE.MeshBasicMaterial({
			map: this.#texture,
			side: THREE.BackSide,
			depthWrite: false,

		});
	}
}

export default DynamicTexture;
