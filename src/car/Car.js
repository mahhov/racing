import * as THREE from 'three';
import GameEntity from '../GameEntity.js';
import Particle from '../Particle.js';
import {cube, meshFromVectors, trapezoid, TrapezoidParams} from '../util/GeometryCreator.js';
import {clamp, radian, rand, UP} from '../util/util.js';
import Controls from './Controls.js';

const FRICTION = .03;
const ACCELERATION = .1;
const TURN = radian(2);

class Car extends GameEntity {
	#game;
	#intersectionManager;
	#lapManager;
	#input;
	#controls;

	#position;
	#velocity = new THREE.Vector3();
	#direction = new THREE.Vector3(0, 0, 1);
	#wheelDirection = new THREE.Vector3(0, 0, 1);

	constructor(game, intersectionManager, lapManager, input, startPosition) {
		super(Car.createMesh());
		this.#game = game;
		this.#intersectionManager = intersectionManager;
		this.#lapManager = lapManager;
		this.#input = input;
		this.#controls = new Controls();
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

	get position() {
		return this.#position.clone();
	}

	get done() {
		return this.#lapManager.lap === this.#lapManager.maxLap;
	}

	update() {
		if (this.#input)
			this.#controls.updatePlayer(this.#input);
		else
			this.#controls.updateAi(this.#position, this.#velocity, this.#direction, this.#intersectionManager);

		let turnSpeed = TURN * clamp(this.#velocity.length(), 0, 1);

		if (this.#controls.forward < 0)
			this.#controls.right *= -1;
		if (this.#controls.brake)
			turnSpeed *= 1.5;

		this.#wheelDirection = -radian(30) * this.#controls.right;

		this.#direction.applyAxisAngle(UP, -turnSpeed * this.#controls.right);

		let decelerate = 1 - FRICTION - (this.#controls.brake ? .05 : 0);
		this.#velocity
			.addScaledVector(this.#direction, ACCELERATION * this.#controls.forward)
			.addScaledVector(this.#direction, this.#velocity.length() * (1 - decelerate) / 2)
			.multiplyScalar(decelerate);

		let intersection = this.#intersectionManager.canMove(this.#position, this.#velocity);
		if (!intersection.position)
			this.#position.add(this.#velocity);
		else {
			let v1 = this.#velocity.clone().projectOnVector(intersection.direction);
			this.#velocity.sub(v1).multiplyScalar(-.2).addScaledVector(v1, .7);
			this.#direction = v1.normalize();
		}

		this.#lapManager.addLap(intersection.lapped);
		this.#lapManager.update();

		let particleCount =
			(this.#controls.brake ? Math.floor(this.#velocity.length()) : 0) +
			(this.#controls.forward ? 3 : 0) +
			(this.#velocity.length() > .1 ? 1 : 0) +
			(intersection.position ? 50 : 0);
		let particleSpeed = .08;
		for (let i = 0; i < particleCount; i++)
			this.#game.addEntity(new Particle(
				this.#position.clone()
					.addScaledVector(this.#direction, rand(1) - 3.5)
					.addScaledVector(this.#direction.clone().applyAxisAngle(UP, radian(90)), rand(3) - 1.5)
					.add(new THREE.Vector3(0, 1, 0)),
				new THREE.Vector3(rand(particleSpeed) - particleSpeed / 2, rand(particleSpeed) - particleSpeed / 2, rand(particleSpeed) - particleSpeed / 2), 100, .4, '#888'));

		this.mesh.position.copy(this.#position);
		this.mesh.lookAt(this.#position.clone().add(this.#direction));
		this.mesh.children[3].rotation.y = this.#wheelDirection;
		this.mesh.children[4].rotation.y = this.#wheelDirection;
	}

	paintUi(ctx, width, height) {
		if (this.#input)
			this.#lapManager.paintUi(ctx, width, height);
	}
}

export default Car;
