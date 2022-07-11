import * as THREE from 'three';

class Intersection {
	intersected; // whether there was an intersection
	horizPosition; // position vector of the intersection or end of movement if no intersection; y = 0
	distance; // proportional distance (0 to 1) until intersection; Infinity if no intersection
	direction; // direction vector of the intersected line; null if no intersection
	groundY; // y position of track at horizPosition
	trackSegmentIndex; // trackSegmentIndex
	lapped; // 0 = no lap, <0 = reverse, >0 = forward

	constructor(intersected, horizPosition, distance, direction) {
		this.intersected = intersected;
		this.horizPosition = horizPosition;
		this.distance = distance;
		this.direction = direction;
	}
}

class IntersectionManager {
	#track;

	constructor(track) {
		this.#track = track;
	}

	// returns null if the 2 lines don't intersect. Otherwise, returns their intersection point and direction of line2
	static #test2Lines(line1, line2) {
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

		return new Intersection(true, line1.at(p1, new THREE.Vector3()), p1, delta2);
	}

	static #lineProjectedHorizontal(...vectors) {
		return new THREE.Line3(...vectors.map(vector => vector.clone().setComponent(1, 0)));
	}

	#getGround(horizPosition, trackSegmentIndex) {
		let segment = this.#track.segments[trackSegmentIndex];
		horizPosition = segment.subLeft1(horizPosition);
		let leftLength = horizPosition.clone().projectOnVector(segment.left).length() / segment.left.length();
		let bottomLength = horizPosition.clone().projectOnVector(segment.bottom).length() / segment.bottom.length();
		return segment.left1.y + leftLength * segment.left.y + bottomLength * segment.bottom.y;
	}

	canMove(position, delta, trackSegmentIndex) {
		let segmentDirection = 0;
		let lapped = 0;
		let movementLine = IntersectionManager.#lineProjectedHorizontal(position, position.clone().add(delta));
		while (true) {
			let segment = this.#track.segments[trackSegmentIndex];
			for (let segmentVectors of [[segment.left1, segment.left2], [segment.right1, segment.right2]]) {
				let segmentLine = IntersectionManager.#lineProjectedHorizontal(...segmentVectors);
				let intersection = IntersectionManager.#test2Lines(movementLine, segmentLine);
				if (intersection) {
					intersection.groundY = this.#getGround(intersection.horizPosition, trackSegmentIndex);
					intersection.trackSegmentIndex = trackSegmentIndex;
					intersection.lapped = lapped;
					return intersection;
				}
			}
			if (segmentDirection !== -1) {
				let segmentLine = IntersectionManager.#lineProjectedHorizontal(segment.left2, segment.right2);
				let intersection = IntersectionManager.#test2Lines(movementLine, segmentLine);
				if (intersection) {
					segmentDirection = 1;
					trackSegmentIndex++;
					if (trackSegmentIndex === this.#track.segments.length) {
						trackSegmentIndex = 0;
						lapped++;
					}
					continue;
				}
			}
			if (segmentDirection !== 1) {
				let segmentLine = IntersectionManager.#lineProjectedHorizontal(segment.left1, segment.right1);
				let intersection = IntersectionManager.#test2Lines(movementLine, segmentLine);
				if (intersection) {
					segmentDirection = -1;
					trackSegmentIndex--;
					if (trackSegmentIndex === -1) {
						trackSegmentIndex = this.#track.segments.length - 1;
						lapped--;
					}
					continue;
				}
			}
			let intersection = new Intersection(false, movementLine.at(1, new THREE.Vector3()), Infinity, null);
			intersection.groundY = this.#getGround(intersection.horizPosition, trackSegmentIndex);
			intersection.trackSegmentIndex = trackSegmentIndex;
			intersection.lapped = lapped;
			return intersection;
		}
	}
}

export default IntersectionManager;
