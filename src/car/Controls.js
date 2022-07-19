import {clamp} from '../util/util.js';

class Controls {
	forward = 0;
	right = 0;
	brake = false;
	sprint = false;

	updatePlayer(input) {
		// todo when going backwards via momentum rather than 'd', left & right are inverted
		this.forward = input.getKey('w', true) ? 1 : (input.getKey('s', true) ? -.5 : 0);
		this.right = input.getKey('d', true) ? 1 : (input.getKey('a', true) ? -1 : 0);
		this.brake = input.getKey(' ', true);
		this.sprint = input.getKey('shift', true);
	}

	updateAi(position, velocity, direction, trackSegmentIndex, intersectionManager) {
		this.forward = 1;
		this.right = 0;
		this.brake = false;

		let intersection = intersectionManager.canMove(position, velocity.clone().multiplyScalar(100), trackSegmentIndex);
		if (intersection.intersected) {
			let distance = intersection.distance * 100;
			let cross = intersection.direction.normalize().cross(velocity.clone().normalize().add(direction).normalize()).y;
			if (distance < 80)
				this.right = Math.sign(cross) * clamp(1 - distance / 80, 0, 1);
			if (distance < 20)
				this.brake = true;
		}
	}
}

export default Controls;
