import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import DynamicTexture from './util/DynamicTexture.js';
import {radian, UP} from './util/util.js';

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
		let dir90 = dir.clone().applyAxisAngle(UP, radian(90));
		let left1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, w1);
		let right1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, -w1);
		let left2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, w2);
		let right2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, -w2);
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

	lineAt(x, y, x2, y2, width = this.#width) {
		this.moveTo(x, y, width);
		this.pathTo(x2, y2, width);
		return this;
	}

	moveTo(x, y, width = this.#width) {
		this.#position = new THREE.Vector3(x, 0, y);
		this.#width = width;
		return this;
	}

	pathTo(x, y, width = this.#width) {
		let newSegment = Segment.fromLine(this.#position, new THREE.Vector3(x, 0, y), this.#width, width);
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
	segments;
	startPosition;
	texture;

	constructor(width, length, segments, startPosition) {
		let texture = Track.createTexture(width, length, segments);
		super(Track.createMesh(width, length, texture));
		this.texture = texture;
		this.segments = segments;
		this.startPosition = startPosition;
	}

	static track1() {
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

	static trackSquare() {
		let segments = new SegmentCreator()
			.moveTo(100, 200, 30)
			.pathTo(100, 500)
			.moveTo(200, 600)
			.pathTo(500, 600)
			.moveTo(600, 500)
			.pathTo(600, 200)
			.moveTo(500, 100)
			.pathTo(200, 100)
			.done();
		return new Track(700, 700, segments, new THREE.Vector3(100, 0, 300));
	}

	static trackB() {
		let segments = new SegmentCreator()
			.lineAt(100, 200, 100, 900, 30) // forward 800
			.lineAt(200, 1000, 400, 1000) // left 200
			.lineAt(500, 900, 500, 800) // down 100
			.lineAt(400, 700, 300, 700) // right 100
			.lineAt(200, 600, 200, 500) // down 100
			.lineAt(300, 400, 400, 400) // left 100
			.lineAt(500, 300, 500, 200) // down 100
			.lineAt(400, 100, 200, 100)  // right 200
			.done();
		return new Track(1100, 1100, segments, new THREE.Vector3(100, 0, 300));
	}

	static createTexture(width, length, segments) {
		let SQUARE_SIZE = 10;
		let texture = new DynamicTexture(width, length);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < width / SQUARE_SIZE; x++)
			for (let y = 0; y < length / SQUARE_SIZE; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

		texture.ctx.fillStyle = '#00f';
		segments.forEach((segment, i) => {
			texture.ctx.fillStyle = `rgb(0,0,${155 + Math.floor(100 * i / segments.length)})`;
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x, segment.left1.z);
			texture.ctx.lineTo(segment.right1.x, segment.right1.z);
			texture.ctx.lineTo(segment.right2.x, segment.right2.z);
			texture.ctx.lineTo(segment.left2.x, segment.left2.z);
			texture.ctx.fill();
		});
		texture.ctx.strokeStyle = '#fff';
		segments.forEach(segment => {
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x, segment.left1.z);
			texture.ctx.lineTo(segment.left2.x, segment.left2.z);
			texture.ctx.moveTo(segment.right1.x, segment.right1.z);
			texture.ctx.lineTo(segment.right2.x, segment.right2.z);
			texture.ctx.stroke();
		});

		return texture;
	}

	static createMesh(width, length, texture) {
		let geometry = new THREE.PlaneGeometry(width, length);
		geometry.lookAt(new THREE.Vector3(0, 1, 0));
		geometry.translate(width / 2, 0, length / 2);
		return new THREE.Mesh(geometry, texture.phongMaterial);
	}
}

export default Track;
