import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import {cube} from './GeometryCreator.js';
import Particle from './Particle.js';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const rand = max => Math.random() * max;
const radian = degree => degree / 180 * Math.PI;

const FRICTION = .03;
const ACCELERATION = .1;
const TURN = radian(2);

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

		const UP = new THREE.Vector3(0, 1, 0);
		this.#direction.applyAxisAngle(UP, -turnSpeed * right);

		let decelerate = 1 - FRICTION - (brake ? .05 : 0);
		this.#velocity
			.addScaledVector(this.#direction, ACCELERATION * forward)
			.addScaledVector(this.#direction, this.#velocity.length() * (1 - decelerate) / 2)
			.multiplyScalar(decelerate);
		this.#position.add(this.#velocity);

		let particleCount = (brake ? Math.floor(this.#velocity.length()) : 0) + (forward ? 3 : 0) + (this.#velocity.length() > .1 ? 1 : 0);
		for (let i = 0; i < particleCount; i++)
			game.addParticle(new Particle(
				this.#position.clone()
					.addScaledVector(this.#direction, rand(1) - 3.5)
					.addScaledVector(this.#direction.clone().applyAxisAngle(UP, radian(90)), rand(3) - 1.5),
				new THREE.Vector3(rand(.02) - .01, rand(.02) - .01, rand(.02) - .01), 100, .4, 0x003300));
	}

	paint() {
		this.mesh.position.copy(this.#position);
		this.mesh.lookAt(this.#position.clone().add(this.#direction));
	}

	get position() {
		return this.#position.clone();
	}
}

export default Car;
