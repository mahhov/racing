import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import {cube} from './GeometryCreator.js';
import Particle from './Particle.js';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const FRICTION = .03;
const ACCELERATION = .1;
const TURN = 1 / 90 * Math.PI;

class Car extends GameEntity {
	#position = new THREE.Vector3();
	#velocity = new THREE.Vector3();
	#direction = new THREE.Vector3(0, 0, 1);

	constructor() {
		super(Car.createMesh());
	}

	static createMesh() {
		const vertices = new Float32Array([
			...cube([-1.5, 0, -2.5], 3, 5, [-1, 1.25, -2], 2, 3),
		]);
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.scale(-1, 1, 1);
		geometry.computeVertexNormals();
		let material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		return new THREE.Mesh(geometry, material);
	}

	update(game, input) {
		let turnSpeed = TURN * clamp(this.#velocity.length(), 0, 1);

		let forward = input.get('w') ? 1 : (input.get('s') ? -.5 : 0);
		let right = input.get('d') ? 1 : (input.get('a') ? -1 : 0);
		let brake = input.get(' ');
		if (forward < 0)
			right *= -1;
		if (brake)
			turnSpeed *= 1.5;

		let decelerate = 1 - FRICTION - (brake ? .05 : 0);

		if (forward)
			this.#velocity.addScaledVector(this.#direction, ACCELERATION * forward);
		if (right)
			this.#direction = this.#direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), -turnSpeed * right);

		this.#position.add(this.#velocity);
		this.#velocity.multiplyScalar(decelerate);

		game.addParticle(new Particle(this.#position.clone(), new THREE.Vector3(0, 0, 0), 100, .1, 0x00ff00));
	}

	paint() {
		this.mesh.position.copy(this.#position);
		this.mesh.lookAt(this.#position.clone().add(this.#direction));
		// this.mesh.lookAt(this.#position.clone().add(this.#velocity));
	}

	get position() {
		return this.#position.clone();
	}
}

export default Car;
