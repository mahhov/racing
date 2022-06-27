import * as THREE from 'three';

class DynamicTexture {
	#ctx;
	#texture;
	#material;

	constructor(width, height) {
		let canvas = new OffscreenCanvas(width, height);
		this.#ctx = canvas.getContext('2d');
		this.#texture = new THREE.Texture(canvas);
		this.#texture.magFilter = THREE.NearestFilter;
		this.#texture.minFilter = THREE.NearestFilter;
		this.#material = new THREE.MeshPhongMaterial({
			shininess: 0,
			map: this.#texture,
		});
	}

	get ctx() {
		this.#texture.needsUpdate = true;
		return this.#ctx;
	}

	get material() {
		return this.#material;
	}
}

export default DynamicTexture;
