import * as THREE from 'three';

class Intersection {
	position;
	distance;
	direction;

	constructor(position, distance, direction) {
		this.position = position;
		this.distance = distance;
		this.direction = direction;
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
			return null;

		let delta1 = line1.delta(new THREE.Vector3());
		let delta2 = line2.delta(new THREE.Vector3());
		let denominator = -delta1.clone().cross(delta2).y;
		// check parallel
		if (!denominator)
			return null;

		let delta3 = line1.start.clone().sub(line2.start);
		let p1 = (delta2.x * delta3.z - delta2.z * delta3.x) / denominator;
		let p2 = (delta1.x * delta3.z - delta1.z * delta3.x) / denominator;
		// check intersection in range
		if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1)
			return null;

		return new Intersection(line1.at(p1, new THREE.Vector3()), p1, delta2);
	}

	canMove(position, delta) {
		let closestIntersection = null;
		let movementLine = new THREE.Line3(position, position.clone().add(delta));
		this.#track.segments.forEach((segment, i) => {
			[[segment.left1, segment.left2], [segment.right1, segment.right2]].forEach(([p1, p2]) => {
				p1 = new THREE.Vector3(p1.x, 0, p1.y);
				p2 = new THREE.Vector3(p2.x, 0, p2.y);
				let segmentLine = new THREE.Line3(p1, p2);
				let intersection = IntersectionManager.test2Lines(movementLine, segmentLine);
				if (intersection && (!closestIntersection || intersection.distance < closestIntersection.distance))
					closestIntersection = intersection;
			});
		});
		return closestIntersection;
	}
}

export default IntersectionManager;
