import * as THREE from 'three';
import DynamicTexture from './DynamicTexture.js';
import GameEntity from './GameEntity.js';
import {radian, UP} from './util.js';

class Segment {
	#p1;
	#p2;
	#w1;
	#w2;
	#dir90;

	constructor(p1, p2, w1, w2) {
		this.#p1 = p1;
		this.#p2 = p2;
		this.#w1 = w1;
		this.#w2 = w2;
		this.#dir90 = p2.clone().sub(p1).rotateAround(new THREE.Vector2(), radian(90)).normalize();
	}

	get left1() {
		return this.#p1.clone().addScaledVector(this.#dir90, this.#w1).toArray();
	}

	get right1() {
		return this.#p1.clone().addScaledVector(this.#dir90, -this.#w1).toArray();
	}

	get left2() {
		return this.#p2.clone().addScaledVector(this.#dir90, this.#w2).toArray();
	}

	get right2() {
		return this.#p2.clone().addScaledVector(this.#dir90, -this.#w2).toArray();
	}
}

class Track extends GameEntity {
	#segments;
	startPosition;

	constructor(width, length, segments, startPosition) {
		super(Track.createMesh(width, length, segments));
		this.#segments = segments;
		this.startPosition = startPosition;
	}

	static Track1() {
		let segments = [
			new Segment(new THREE.Vector2(0, 0), new THREE.Vector2(0, 450), 10, 10),
		];
		return new Track(1000, 1000, segments, new THREE.Vector3(10, 0, 0));
	}

	static createMesh(width, length, segments) {
		let squareSize = 10;
		let texture = new DynamicTexture(width, length);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < width / squareSize; x++)
			for (let y = 0; y < length / squareSize; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

		texture.ctx.fillStyle = '#00f';
		segments.forEach(segment => {
			texture.ctx.beginPath();
			texture.ctx.moveTo(...segment.left1);
			texture.ctx.lineTo(...segment.right1);
			texture.ctx.lineTo(...segment.right2);
			texture.ctx.lineTo(...segment.left2);
			texture.ctx.closePath();
			texture.ctx.fill();
		});

		let geometry = new THREE.PlaneGeometry(width, length);
		geometry.lookAt(new THREE.Vector3(0, 1, 0));
		geometry.translate(width / 2, 0, length / 2);
		return new THREE.Mesh(geometry, texture.material);
	}
}

export default Track;
