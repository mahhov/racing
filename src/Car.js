import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import {cube, meshFromVectors, trapezoid, TrapezoidParams} from './GeometryCreator.js';
import Particle from './Particle.js';
import {clamp, radian, rand, UP} from './util.js';

const FRICTION = .03;
const ACCELERATION = .1;
const TURN = radian(2);

class Car extends GameEntity {
	#position;
	#velocity = new THREE.Vector3();
	#direction = new THREE.Vector3(0, 0, 1);
	#wheelDirection = new THREE.Vector3(0, 0, 1);

	constructor(startPosition) {
		super(Car.createMesh());
		this.#position = startPosition;
	}

	static createMesh() {
		const WIDTH_HALF = 1.5, LENGTH_HALF = 2.5;
		const TIRE_THICKNESS = .5, TIRE_WIDTH = 1;
		let material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		let group = new THREE.Group();
		let bodyMesh = meshFromVectors(trapezoid(
			new TrapezoidParams([-WIDTH_HALF, .5, -LENGTH_HALF], 3, 5),
			new TrapezoidParams([-WIDTH_HALF, 1.25, -LENGTH_HALF], 3, 5),
			new TrapezoidParams([-1, 1.75, -2], 2, 3)), material);
		group.add(bodyMesh);
		let backLeftTireMesh = meshFromVectors(cube([-TIRE_THICKNESS / 2, 0, -TIRE_WIDTH / 2], TIRE_THICKNESS, TIRE_WIDTH, TIRE_WIDTH), material);
		backLeftTireMesh.position.copy(new THREE.Vector3(-WIDTH_HALF, 0, -LENGTH_HALF));
		group.add(backLeftTireMesh);
		let backRightTireMesh = backLeftTireMesh.clone();
		backRightTireMesh.position.copy(new THREE.Vector3(WIDTH_HALF, 0, -LENGTH_HALF));
		group.add(backRightTireMesh);
		let frontLeftTireMesh = backLeftTireMesh.clone();
		frontLeftTireMesh.position.copy(new THREE.Vector3(-WIDTH_HALF, 0, LENGTH_HALF - .5));
		group.add(frontLeftTireMesh);
		let frontRightTireMesh = backLeftTireMesh.clone();
		frontRightTireMesh.position.copy(new THREE.Vector3(WIDTH_HALF, 0, LENGTH_HALF - .5));
		group.add(frontRightTireMesh);
		return group;
	}

	update(game, intersectionManager, lapManager, input) {
		let turnSpeed = TURN * clamp(this.#velocity.length(), 0, 1);

		let forward = input.get('w') ? 1 : (input.get('s') ? -.5 : 0);
		let right = input.get('d') ? 1 : (input.get('a') ? -1 : 0);
		let brake = input.get(' ');
		if (forward < 0)
			right *= -1;
		if (brake)
			turnSpeed *= 1.5;

		this.#wheelDirection = -radian(30) * right;

		this.#direction.applyAxisAngle(UP, -turnSpeed * right);

		let decelerate = 1 - FRICTION - (brake ? .05 : 0);
		this.#velocity
			.addScaledVector(this.#direction, ACCELERATION * forward)
			.addScaledVector(this.#direction, this.#velocity.length() * (1 - decelerate) / 2)
			.multiplyScalar(decelerate);

		let intersection = intersectionManager.canMove(this.#position, this.#velocity);
		if (!intersection.position)
			this.#position.add(this.#velocity);
		else {
			let v1 = this.#velocity.clone().projectOnVector(intersection.direction);
			this.#velocity.sub(v1).multiplyScalar(-.2).add(v1);
			this.#direction = v1.normalize();
		}

		lapManager.addLap(intersection.lapped);

		let particleCount =
			(brake ? Math.floor(this.#velocity.length()) : 0) +
			(forward ? 3 : 0) +
			(this.#velocity.length() > .1 ? 1 : 0) +
			(intersection.position ? 50 : 0);
		for (let i = 0; i < particleCount; i++)
			game.addParticle(new Particle(
				this.#position.clone()
					.addScaledVector(this.#direction, rand(1) - 3.5)
					.addScaledVector(this.#direction.clone().applyAxisAngle(UP, radian(90)), rand(3) - 1.5)
					.add(new THREE.Vector3(0, 1, 0)),
				new THREE.Vector3(rand(.02) - .01, rand(.02) - .01, rand(.02) - .01), 100, .4, '#333'));
	}

	paint() {
		this.mesh.position.copy(this.#position);
		this.mesh.lookAt(this.#position.clone().add(this.#direction));

		this.mesh.children[3].rotation.y = this.#wheelDirection;
		this.mesh.children[4].rotation.y = this.#wheelDirection;
	}

	get position() {
		return this.#position.clone();
	}
}

export default Car;
