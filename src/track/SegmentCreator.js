import * as THREE from 'three';
import IntersectionManager from '../IntersectionManager.js';
import {getBounds, radian, UP} from '../util/util.js';
import Track from './Track.js';

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

	static fromLine(p1, w1, p2, w2) {
		let dir = p2.clone().sub(p1).normalize();
		let dir90 = dir.clone().projectOnPlane(UP).applyAxisAngle(UP, radian(90)).normalize();
		let left1 = p1.clone().addScaledVector(dir90, w1);
		let right1 = p1.clone().addScaledVector(dir90, -w1);
		let left2 = p2.clone().addScaledVector(dir90, w2);
		let right2 = p2.clone().addScaledVector(dir90, -w2);
		return new Segment(left1, right1, left2, right2);
	}

	subLeft1(vec) {
		return vec.clone().sub(this.left1);
	}

	subRight1(vec) {
		return vec.clone().sub(this.right1);
	}

	get left() {
		return this.subLeft1(this.left2);
	}

	get right() {
		return this.subRight1(this.right2);
	}

	// like bottom, but perpendicular to left and flat
	get flatLeft90() {
		// let t = this.left.clone().projectOnPlane(UP).applyAxisAngle(UP, radian(-90));
		return this.bottom.clone().projectOnPlane(this.left);
	}

	get bottom() {
		return this.subLeft1(this.right1);
	}

	get normal() {
		return this.left.clone().cross(this.bottom).normalize();
	}

	get flatLeftLine() {
		return new THREE.Line3(IntersectionManager.flat(this.left1), IntersectionManager.flat(this.left2));
	}

	get flatRightLine() {
		return new THREE.Line3(IntersectionManager.flat(this.right1), IntersectionManager.flat(this.right2));
	}
}

class SegmentCreator {
	#xyzws = [];

	point(x, y, z, w = 30) {
		this.#xyzws.push([x, y, z, w]);
		return this;
	}

	done() {
		let segments = this.#xyzws
			.map(xyzw => [new THREE.Vector3(...xyzw), xyzw[3]])
			.map((p, i, a) => {
				let j = (i + 1) % a.length;
				return Segment.fromLine(...p, ...a[j]);
			});
		segments.forEach((segment, i, a) => {
			let j = (i + 1) % a.length;
			let nextSegment = a[j];
			let leftIntersection = IntersectionManager.test2Lines(segment.flatLeftLine, nextSegment.flatLeftLine, true);
			if (leftIntersection) {
				segment.left2 = segment.left1.clone().addScaledVector(segment.left, leftIntersection.distance1);
				nextSegment.left1 = nextSegment.left1.clone().addScaledVector(nextSegment.left, leftIntersection.distance2);
			}
			let rightIntersection = IntersectionManager.test2Lines(segment.flatRightLine, nextSegment.flatRightLine, true);
			if (rightIntersection) {
				segment.right2 = segment.right1.clone().addScaledVector(segment.right, rightIntersection.distance1);
				nextSegment.right1 = nextSegment.right1.clone().addScaledVector(nextSegment.right, rightIntersection.distance2);
			}
		});

		let bounds = [0, 0, 0].map((_, i) => getBounds(...segments.flatMap(s => [s.left1.getComponent(i), s.right1.getComponent(i)])));
		let shift = new THREE.Vector3().fromArray(bounds.map(b => b[0])).multiplyScalar(-1).add(new THREE.Vector3(100, 0, 100));
		let max = new THREE.Vector3().fromArray(bounds.map(b => b[1]));
		max.add(shift).add(new THREE.Vector3(100, 300, 100));
		segments.forEach(s => [s.left1, s.right1, s.left2, s.right2].forEach(p => p.add(shift)));
		return new Track(segments, max);
	}
}

export default SegmentCreator;
