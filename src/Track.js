import * as THREE from 'three';
import DynamicTexture from './DynamicTexture.js';
import GameEntity from './GameEntity.js';

let emptyArray = (n, valueFunc) => [...Array(100)].map(valueFunc);

class Track extends GameEntity {
	#terrain = [];

	constructor(terrain) {
		super(Track.createMesh(terrain));
		this.#terrain = terrain;
	}

	static Track1() {
		let terrain = emptyArray(100, () => emptyArray(100, () => [0, false]));

		return new Track(terrain);
	}

	static createMesh(terrain) {
		let w = 100, n = 100;
		let texture = new DynamicTexture(w, w);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < n; x++)
			for (let y = 0; y < n; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * w / n, y * w / n, w / n, w / n);

		let geometry = new THREE.PlaneGeometry(1000, 1000);
		geometry.lookAt(new THREE.Vector3(0, 1, 0));
		return new THREE.Mesh(geometry, texture.material);
	}
}

export default Track;
