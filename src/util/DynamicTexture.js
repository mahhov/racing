import * as THREE from 'three';

class DynamicTexture {
	#width;
	#height;
	#canvas;
	#ctx;
	#texture;

	constructor(width, height) {
		this.#width = width;
		this.#height = height;
		this.#canvas = new OffscreenCanvas(width, height);
		this.#ctx = this.#canvas.getContext('2d');
		this.#texture = new THREE.Texture(this.#canvas);
		this.#texture.magFilter = THREE.NearestFilter;
		this.#texture.minFilter = THREE.NearestFilter;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
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
