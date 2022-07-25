import * as THREE from 'three';
import GameEntity from '../GameEntity.js';
import Particle from '../Particle.js';
import {cube, meshFromVectors, trapezoid, TrapezoidParams} from '../util/GeometryCreator.js';
import {clamp, radian, rand, UP} from '../util/util.js';
import Controls from './Controls.js';

class Car extends GameEntity {
	#game;
	#track;
	#intersectionManager;
	#lapManager;
	#input;
	#controls;

	#params;
	#position;
	#direction;
	#velocity = new THREE.Vector3();
	#trackSegmentIndex = 0;
	#grounded = true;

	constructor(game, track, intersectionManager, lapManager, input, params, startPosition, startDirection) {
		super(Car.createMesh());
		this.#game = game;
		this.#track = track;
		this.#intersectionManager = intersectionManager;
		this.#lapManager = lapManager;
		this.#input = input;
		this.#controls = new Controls();

		this.#params = params;
		this.#position = startPosition;
		this.#direction = startDirection;
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
		this.#velocity.y = 0;
		this.#velocityUpdate(this.#params.turn, this.#params.acceleration, this.#params.friction, this.#params.brake, this.#params.gravity);
	}

	#airVelocityUpdate() {
		let friction = this.#controls.sprint ? 0 : this.#params.airFriction;
		let acceleration = this.#controls.sprint ? this.#params.acceleration : 0;
		let gravity = this.#controls.sprint ? this.#params.gravity * 2 : this.#params.gravity;
		this.#velocityUpdate(this.#params.turn, acceleration, friction, this.#params.airBrake, gravity);
	}

	#velocityUpdate(turn, acceleration, friction, brake, gravity) {
		let dirSign = Math.sign(this.#velocity.dot(this.#direction));

		let turnSpeed = turn * clamp(this.#velocity.length(), 0, 1) * (this.#controls.brake ? 1.5 : 1);
		this.#direction.applyAxisAngle(this.#dirUp, -turnSpeed * this.#controls.right * dirSign);
		if (this.#grounded)
			this.#direction.projectOnPlane(this.#track.segments[this.#trackSegmentIndex].normal);
		else
			this.#direction.setComponent(1, 0).normalize();

		let accelerate = acceleration * this.#controls.forward;
		let decelerate = friction + (this.#controls.brake ? brake : 0);
		this.#velocity
			.addScaledVector(this.#direction, accelerate + this.#velocity.length() * decelerate / 2 * dirSign)
			.multiplyScalar(1 - decelerate)
			.add(new THREE.Vector3(0, gravity, 0));
		if (this.#grounded)
			this.#velocity.add(
				new THREE.Vector3(0, gravity, 0)
					.projectOnPlane(this.#track.segments[this.#trackSegmentIndex].normal));
	}

	#applyVelocity() {
		let remaining = 1;
		let anyIntersection = false;
		let groundY = 0;
		while (remaining > .1) {
			let velocity = this.#velocity.clone().multiplyScalar(remaining);
			let intersection = this.#intersectionManager.canMove(this.#position, velocity, this.#trackSegmentIndex);
			groundY = intersection.groundY;
			this.#lapManager.addLap(intersection.lapped);
			this.#lapManager.update();
			this.#trackSegmentIndex = intersection.trackSegmentIndex;
			if (!intersection.intersected) {
				this.#position.add(velocity);
				break;
			} else {
				anyIntersection = true;
				remaining *= (1 - intersection.distance);
				this.#position.addScaledVector(velocity, intersection.distance);
				this.#velocity.projectOnVector(intersection.direction);
				this.#direction.projectOnVector(intersection.direction).normalize();
			}
		}
		if (anyIntersection && this.#grounded)
			this.#velocity.multiplyScalar(this.#params.intersectionFriction);

		return groundY;
	}

	#checkGround(groundY) {
		this.#grounded = this.#position.y <= groundY + 1.5;
		if (this.#grounded)
			this.#position.y = groundY;
	}

	#addParticles() {
		let particleCount =
			(this.#controls.brake ? Math.floor(this.#velocity.length()) : 0) +
			(this.#controls.forward ? 3 : 0) +
			(this.#velocity.length() > .5 ? 1 : 0);
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
		return this.#direction.clone().cross(UP).cross(this.#direction).normalize();
	}

	update() {
		this.#updateControls();
		if (this.#grounded)
			this.#groundVelocityUpdate();
		else
			this.#airVelocityUpdate();
		let groundY = this.#applyVelocity();
		this.#checkGround(groundY);

		this.#addParticles();
		this.#updateMesh();
	}

	paintUi(uiTexture) {
		if (this.#input)
			this.#lapManager.paintUi(uiTexture);
	}
}

export default Car;
