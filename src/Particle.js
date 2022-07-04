import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import DynamicTexture from './util/DynamicTexture.js';

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
		let texture = new DynamicTexture(1, 1);
		texture.ctx.fillStyle = color;
		texture.ctx.fillRect(0, 0, 1, 1);
		let material = texture.spriteMaterial;
		let sprite = new THREE.Sprite(material);
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
