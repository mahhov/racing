import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import DynamicTexture from './util/DynamicTexture.js';

class Particle extends GameEntity {
	static #materialCache = [];

	#velocity;
	#duration;

	constructor(position, velocity, duration, size, color) {
		super(Particle.createMesh(size, color));
		this.mesh.position.copy(position);
		this.#duration = duration;
		this.#velocity = velocity;
	}

	static createMesh(size, color) {
		if (!Particle.#materialCache[color]) {
			let texture = new DynamicTexture(3, 3);
			texture.ctx.strokeStyle = color;
			texture.ctx.strokeRect(0, 0, 3, 3);
			Particle.#materialCache[color] = texture.spriteMaterial;
		}
		let sprite = new THREE.Sprite(Particle.#materialCache[color]);
		sprite.scale.set(size, size, 1);
		return sprite;
	}

	update() {
		if (!this.#duration--)
			return true;
		this.mesh.position.add(this.#velocity);
	}
}

export default Particle;
