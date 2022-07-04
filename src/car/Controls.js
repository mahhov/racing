import {clamp} from '../util/util.js';

class Controls {
	forward = 0;
	right = 0;
	brake = false;

	updatePlayer(input) {
		this.forward = input.getKey('w', true) ? 1 : (input.getKey('s', true) ? -.5 : 0);
		this.right = input.getKey('d', true) ? 1 : (input.getKey('a', true) ? -1 : 0);
		this.brake = input.getKey(' ', true);
	}

	updateAi(position, velocity, direction, intersectionManager) {
		this.forward = 1;
		this.right = 0;
		this.brake = false;

		let intersection = intersectionManager.canMove(position, velocity.clone().multiplyScalar(100));
		if (intersection.position) {
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
