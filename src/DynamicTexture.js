import * as THREE from 'three';

class DynamicTexture {
	#ctx;
	#texture;

	constructor(width, height) {
		let canvas = new OffscreenCanvas(width, height);
		this.#ctx = canvas.getContext('2d');
		this.#texture = new THREE.Texture(canvas);
		this.#texture.magFilter = THREE.NearestFilter;
		this.#texture.minFilter = THREE.NearestFilter;
	}

	get ctx() {
		this.#texture.needsUpdate = true;
		return this.#ctx;
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
}

export default DynamicTexture;
