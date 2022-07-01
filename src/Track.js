import * as THREE from 'three';
import DynamicTexture from './DynamicTexture.js';
import GameEntity from './GameEntity.js';
import {radian} from './util.js';

class Segment {
	left1;
	right1;
	left2;
	right2;

	constructor(left1, right1, left2, right2) {
		this.left1 = left1;
		this.right1 = right1;
		this.left2 = left2;
		this.right2 = right2;
	}

	static fromLine(p1, p2, w1, w2) {
		const SMOOTHNESS = .3;
		let dir = p2.clone().sub(p1).normalize();
		let dir90 = dir.clone().rotateAround(new THREE.Vector2(), radian(90));
		let left1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, w1).toArray();
		let right1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, -w1).toArray();
		let left2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, w2).toArray();
		let right2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, -w2).toArray();
		return new Segment(left1, right1, left2, right2);
	}

	static connectSegments(segment1, segment2) {
		return new Segment(segment1.left2, segment1.right2, segment2.left1, segment2.right1);
	}
}

class SegmentCreator {
	#segments = [];
	#position;
	#width;

	moveTo(x, y, width = this.#width) {
		this.#position = new THREE.Vector2(x, y);
		this.#width = width;
		return this;
	}

	pathTo(x, y, width = this.#width) {
		let newSegment = Segment.fromLine(this.#position, new THREE.Vector2(x, y), this.#width, width);
		let lastSegment = this.#segments[this.#segments.length - 1];
		if (lastSegment)
			this.#segments.push(Segment.connectSegments(lastSegment, newSegment));
		this.#segments.push(newSegment);
		return this.moveTo(x, y, width);
	}

	done() {
		let lastSegment = this.#segments[this.#segments.length - 1];
		if (lastSegment)
			this.#segments.push(Segment.connectSegments(lastSegment, this.#segments[0]));
		return this.#segments;
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
		let segments = new SegmentCreator()
			.moveTo(100, 100, 50)
			.pathTo(100, 1200)
			.pathTo(800, 1300)
			.pathTo(1300, 1200)
			.pathTo(800, 900)
			.pathTo(300, 800)
			.pathTo(300, 600)
			.pathTo(800, 400)
			.pathTo(600, 100)
			.pathTo(100, 100)
			.done();

		return new Track(1400, 1400, segments, new THREE.Vector3(100, 0, 100));
	}

	static TrackSquare() {
		let right = Segment.fromLine(new THREE.Vector2(100, 200), new THREE.Vector2(100, 500), 50, 50);
		let top = Segment.fromLine(new THREE.Vector2(200, 600), new THREE.Vector2(500, 600), 50, 50);
		let left = Segment.fromLine(new THREE.Vector2(600, 500), new THREE.Vector2(600, 200), 50, 50);
		let bottom = Segment.fromLine(new THREE.Vector2(500, 100), new THREE.Vector2(200, 100), 50, 50);
		let segments = [right, top, left, bottom].flatMap((segment, i, segments) =>
			[segment, Segment.connectSegments(segment, segments[i < segments.length - 1 ? i + 1 : 0])]);
		return new Track(1400, 1400, segments, new THREE.Vector3(100, 0, 100));
	}

	static createMesh(width, length, segments) {
		let SQUARE_SIZE = 10;
		let texture = new DynamicTexture(width, length);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < width / SQUARE_SIZE; x++)
			for (let y = 0; y < length / SQUARE_SIZE; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

		texture.ctx.fillStyle = '#00f';
		texture.ctx.strokeStyle = '#fff';
		[true, false].forEach(fill =>
			segments.forEach(segment => {
				texture.ctx.beginPath();
				texture.ctx.moveTo(...segment.left1);
				texture.ctx.lineTo(...segment.right1);
				texture.ctx.lineTo(...segment.right2);
				texture.ctx.lineTo(...segment.left2);
				texture.ctx.closePath();
				fill ? texture.ctx.fill() : texture.ctx.stroke();
			}));

		let geometry = new THREE.PlaneGeometry(width, length);
		geometry.lookAt(new THREE.Vector3(0, 1, 0));
		geometry.translate(width / 2, 0, length / 2);
		return new THREE.Mesh(geometry, texture.material);
	}
}

export default Track;
