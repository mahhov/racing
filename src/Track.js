import * as THREE from 'three';
import GameEntity from './GameEntity.js';
import DynamicTexture from './util/DynamicTexture.js';
import {meshFromVectors, rect} from './util/GeometryCreator.js';
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

	lineAt(x, z, x2, z2, width = this.#width) {
		this.moveTo(x, 0, z, width);
		this.pathTo(x2, 0, z2, width);
		return this;
	}

	vertLineAt(x, y, z, x2, y2, z2, width = this.#width) {
		this.moveTo(x, y, z, width);
		this.pathTo(x2, y2, z2, width);
		return this;
	}

	moveTo(x, y, z, width = this.#width) {
		this.#position = new THREE.Vector3(x, y, z);
		this.#width = width;
		return this;
	}

	pathTo(x, y, z, width = this.#width) {
		let newSegment = Segment.fromLine(this.#position, new THREE.Vector3(x, y, z), this.#width, width);
		let lastSegment = this.#segments[this.#segments.length - 1];
		if (lastSegment)
			this.#segments.push(Segment.connectSegments(lastSegment, newSegment));
		this.#segments.push(newSegment);
		return this.moveTo(x, y, z, width);
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
		super(Track.createMesh(width, length, segments));
		this.texture = Track.createTexture(width, length, segments);
		this.segments = segments;
		this.startPosition = startPosition;
	}

	static trackSquare() {
		let segments = new SegmentCreator()
			.lineAt(100, 200, 100, 500, 30)
			.lineAt(200, 600, 500, 600)
			.lineAt(600, 500, 600, 200)
			.lineAt(500, 100, 200, 100)
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

	static trackX() {
		let segments = new SegmentCreator()
			.lineAt(100, 200, 100, 600, 30)
			.vertLineAt(200, 0, 700, 1200, 100, 700)
			.lineAt(1300, 800, 1300, 1200)
			.lineAt(1200, 1300, 800, 1300)
			.lineAt(700, 1200, 700, 200)
			.lineAt(600, 100, 200, 100)
			.done();
		return new Track(1400, 1400, segments, new THREE.Vector3(100, 0, 300));
	}

	static createTexture(width, length, segments) {
		let texture = Track.createTextureCheck(width, length);

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

	static createMesh(width, length, segments) {
		let group = new THREE.Group();
		let geometry = new THREE.PlaneGeometry(width, length);
		geometry.lookAt(new THREE.Vector3(0, 1, 0));
		geometry.translate(width / 2, -1, length / 2);
		group.add(new THREE.Mesh(geometry, Track.createTextureCheck(width, length).phongMaterial));

		segments.forEach((segment, i) => {
			let material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: 155 + Math.floor(100 * i / segments.length)});
			let segmentMesh = meshFromVectors(rect(segment.left1.toArray(), segment.right1.toArray(), segment.right2.toArray(), segment.left2.toArray()), material);
			group.add(segmentMesh);
		});

		return group;
	}

	static createTextureCheck(width, length) {
		let SQUARE_SIZE = 10;
		let texture = new DynamicTexture(width, length);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < width / SQUARE_SIZE; x++)
			for (let y = 0; y < length / SQUARE_SIZE; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
		return texture;
	}
}

export default Track;
