import * as THREE from 'three';
import GameEntity from '../GameEntity.js';
import Particle from '../Particle.js';
import {cube, meshFromVectors, trapezoid, TrapezoidParams} from '../util/GeometryCreator.js';
import {clamp, radian, rand, UP} from '../util/util.js';
import Controls from './Controls.js';

const FRICTION = .03;
const BRAKE = .05;
const ACCELERATION = .1;
const TURN = radian(2);
const GRAVITY = -.02;
const AIR_FRICTION = .01;

class Car extends GameEntity {
	#game;
	#intersectionManager;
	#lapManager;
	#input;
	#controls;

	#position;
	#velocity = new THREE.Vector3();
	#direction = new THREE.Vector3(0, 0, 1);
	#trackSegmentIndex = 0;
	#grounded = true;

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
			new TrapezoidParams([WIDTH_HALF, .5, -LENGTH_HALF], 3, 5),
			new TrapezoidParams([WIDTH_HALF, 1.25, -LENGTH_HALF], 3, 5),
			new TrapezoidParams([1, 1.75, -2], 2, 3)), material);
		group.add(bodyMesh);
		let backLeftTireMesh = meshFromVectors(cube([TIRE_THICKNESS / 2, 0, -TIRE_WIDTH / 2], TIRE_THICKNESS, TIRE_WIDTH, TIRE_WIDTH), material);
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

	#updateControls() {
		if (this.#input)
			this.#controls.updatePlayer(this.#input);
		else
			this.#controls.updateAi(this.#position, this.#velocity, this.#direction, this.#trackSegmentIndex, this.#intersectionManager);
	}

	#groundVelocityUpdate() {
		let turnSpeed = TURN * clamp(this.#velocity.length(), 0, 1) * (this.#controls.brake ? 1.5 : 1);
		let turnSign = Math.sign(this.#velocity.dot(this.#direction));
		this.#direction.applyAxisAngle(this.#dirUp, -turnSpeed * this.#controls.right * turnSign);
		// todo direction tilt

		let accelerate = ACCELERATION * this.#controls.forward;
		let decelerate = FRICTION + (this.#controls.brake ? BRAKE : 0);
		this.#velocity
			.addScaledVector(this.#direction, accelerate + this.#velocity.length() * decelerate / 2)
			.multiplyScalar(1 - decelerate);
		// todo gravity for tilted ground
	}

	#airVelocityUpdate() {
		this.#velocity
			.add(new THREE.Vector3(0, GRAVITY, 0))
			.multiplyScalar(1 - AIR_FRICTION);
		// todo gliding and turning
	}

	#applyVelocity(intersection) {
		if (!intersection.intersected)
			this.#position.add(this.#velocity);
		else {
			let v1 = this.#velocity.clone().projectOnVector(intersection.direction);
			this.#velocity.sub(v1).multiplyScalar(-.2).addScaledVector(v1, .7);
			this.#direction.projectOnVector(intersection.direction).normalize();
		}
	}

	#addParticles(intersection) {
		let particleCount =
			(this.#controls.brake ? Math.floor(this.#velocity.length()) : 0) +
			(this.#controls.forward ? 3 : 0) +
			(this.#velocity.length() > .5 ? 1 : 0) +
			(intersection.intersected ? 50 : 0);
		let particleSpeed = .08;
		for (let i = 0; i < particleCount; i++)
			this.#game.addEntity(new Particle(
				this.#position.clone()
					.addScaledVector(this.#direction, rand(1) - 3.5)
					.addScaledVector(this.#direction.clone().applyAxisAngle(this.#dirUp, radian(90)), rand(3) - 1.5)
					.add(new THREE.Vector3(0, 1, 0)),
				new THREE.Vector3(rand(particleSpeed) - particleSpeed / 2, rand(particleSpeed) - particleSpeed / 2, rand(particleSpeed) - particleSpeed / 2), 100, .4, '#888'));
	}

	#updateMesh() {
		this.mesh.position.copy(this.#position);
		this.mesh.lookAt(this.#position.clone().add(this.#direction));
		let wheelDirection = -radian(30) * this.#controls.right;
		this.mesh.children[3].rotation.y = wheelDirection;
		this.mesh.children[4].rotation.y = wheelDirection;
	}

	get #dirUp() {
		return this.#direction.clone().cross(UP).cross(this.#direction);
	}

	update() {
		this.#updateControls();
		if (this.#grounded)
			this.#groundVelocityUpdate();
		else
			this.#airVelocityUpdate();
		let intersection = this.#intersectionManager.canMove(this.#position, this.#velocity, this.#trackSegmentIndex);
		if (!intersection.intersected) {
			this.#lapManager.addLap(intersection.lapped);
			this.#lapManager.update();
			this.#trackSegmentIndex = intersection.trackSegmentIndex;
		}

		this.#applyVelocity(intersection);

		if (this.#grounded = this.#position.y <= intersection.groundY)
			this.#position.y = intersection.groundY;

		this.#addParticles(intersection);
		this.#updateMesh();
	}

	paintUi(ctx, width, height) {
		if (this.#input)
			this.#lapManager.paintUi(ctx, width, height);
	}
}

export default Car;
