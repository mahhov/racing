import * as THREE from 'three';
import GameEntity from './GameEntity.js';

class Particle extends GameEntity {
	#velocity;
	#duration;

	constructor(position, velocity, duration, size, color) {
		super(Particle.createMesh(size, color));
		this.mesh.position.copy(position);
		this.#duration = duration;
		this.#velocity = velocity;
	}

	static createMesh(size, color) {
		let geometry = new THREE.BoxGeometry(size, size, size);
		let material = new THREE.MeshPhongMaterial({color});
		return new THREE.Mesh(geometry, material);
	}

	update() {
		if (!this.#duration--)
			return true;
		this.mesh.position.add(this.#velocity);
	}

	paint() {
	}
}

export default Particle;
