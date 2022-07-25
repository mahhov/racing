import * as THREE from 'three';
import {radian, UP} from '../util/util.js';
import Track from './Track.js';

class Segment {
	left1;
	right1;
	left2;
	right2;

	left;
	bottom;
	normal;

	constructor(left1, right1, left2, right2) {
		this.left1 = left1;
		this.right1 = right1;
		this.left2 = left2;
		this.right2 = right2;

		this.left = this.subLeft1(this.left2);
		this.bottom = this.subLeft1(this.right1);
		this.normal = this.left.clone().cross(this.bottom).normalize();
	}

	static fromLine(p1, p2, w1, w2) {
		const SMOOTHNESS = 0;
		let dir = p2.clone().sub(p1).normalize();
		let dir90 = dir.clone().projectOnPlane(UP).applyAxisAngle(UP, radian(90));
		let left1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, w1);
		let right1 = p1.clone().addScaledVector(dir, w1 * SMOOTHNESS).addScaledVector(dir90, -w1);
		let left2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, w2);
		let right2 = p2.clone().addScaledVector(dir, -w2 * SMOOTHNESS).addScaledVector(dir90, -w2);
		return new Segment(left1, right1, left2, right2);
	}

	static connectSegments(segment1, segment2) {
		return new Segment(segment1.left2, segment1.right2, segment2.left1, segment2.right1);
	}

	subLeft1(vec) {
		return vec.clone().sub(this.left1);
	}
}

class SegmentCreator {
	#segments = [];
	#position;
	#width = 30;

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
		return new Track(this.#segments);
	}
}

export default SegmentCreator;
