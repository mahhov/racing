import * as THREE from 'three';

class Intersection {
	position;
	distance;
	direction;
	lapped = 0; // 0 = no, -1 = reverse, 1 = forward

	constructor(position, distance, direction) {
		this.position = position;
		this.distance = distance;
		this.direction = direction;
	}

	static NoIntersection() {
		return new Intersection(null, Infinity, null);
	}
}

class IntersectionManager {
	#track;

	constructor(track) {
		this.#track = track;
	}

	static test2Lines(line1, line2) {
		// check 0 lines
		if (!line1.distanceSq() || !line2.distanceSq())
			return Intersection.NoIntersection();

		let delta1 = line1.delta(new THREE.Vector3());
		let delta2 = line2.delta(new THREE.Vector3());
		let denominator = -delta1.clone().cross(delta2).y;
		// check parallel
		if (!denominator)
			return Intersection.NoIntersection();

		let delta3 = line1.start.clone().sub(line2.start);
		let p1 = (delta2.x * delta3.z - delta2.z * delta3.x) / denominator;
		let p2 = (delta1.x * delta3.z - delta1.z * delta3.x) / denominator;
		// check intersection in range
		if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1)
			return Intersection.NoIntersection();

		return new Intersection(line1.at(p1, new THREE.Vector3()), p1, delta2);
	}

	canMove(position, delta) {
		let lapped = 0;
		let closestIntersection = Intersection.NoIntersection();
		let movementLine = new THREE.Line3(position, position.clone().add(delta));
		this.#track.segments.forEach((segment, i) => {
			[[segment.left1, segment.left2], [segment.right1, segment.right2]].forEach(([p1, p2]) => {
				let segmentLine = new THREE.Line3(p1, p2);
				let intersection = IntersectionManager.test2Lines(movementLine, segmentLine);
				if (intersection.distance < closestIntersection.distance)
					closestIntersection = intersection;
			});

			if (i === this.#track.segments.length - 1) {
				let segmentLine = new THREE.Line3(segment.left2, segment.right2);
				let intersection = IntersectionManager.test2Lines(movementLine, segmentLine);
				if (intersection.distance < closestIntersection.distance)
					lapped = Math.sign(segmentLine.delta(new THREE.Vector3()).cross(delta).y);
			}
		});

		closestIntersection.lapped = lapped;
		return closestIntersection;
	}
}

export default IntersectionManager;
