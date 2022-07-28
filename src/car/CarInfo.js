import {radian} from '../util/util.js';

class CarParams {
	friction;
	brake;
	acceleration;
	turn;
	gravity;
	airFriction;
	airBrake;
	intersectionFriction;

	constructor(friction, brake, acceleration, turn, gravity, airFriction, airBrake, intersectionFriction) {
		this.friction = friction;
		this.brake = brake;
		this.acceleration = acceleration;
		this.turn = turn;
		this.gravity = gravity;
		this.airFriction = airFriction;
		this.airBrake = airBrake;
		this.intersectionFriction = intersectionFriction;
	}

	get uiTextArray() {
		return [
			`Friction: ${this.friction}`,
			`Brake: ${this.brake}`,
			`Acceleration: ${this.acceleration}`,
			`Turn: ${this.turn}`,
			`Gravity: ${this.gravity}`,
			`Air friction: ${this.airFriction}`,
			`Air brake: ${this.airBrake}`,
			`Intersection friction: ${this.intersectionFriction}`,
		];
	}
}

class CarInfo {
	name;
	cost;
	carParams;

	constructor(name, cost, carParams) {
		this.name = name;
		this.cost = cost;
		this.carParams = carParams;
	}
}

const CAR_INFOS = [
	new CarInfo('Default', 0,
		new CarParams(.03, .05, .1, radian(2), -.02, .01, .01, .95)),
	new CarInfo('Power', 1000,
		new CarParams(.03, .05, .15, radian(2), -.02, .01, .01, .95)),
	new CarInfo('Good Handling', 1000,
		new CarParams(.06, .1, .16, radian(2.5), -.02, .01, .01, 0)),
	new CarInfo('No Steering', 1000,
		new CarParams(.03, .05, .1, radian(1), -.02, .01, .01, 1.003)),
	new CarInfo('Helium', 0,
		new CarParams(.03, .05, .1, radian(2), -.018, .01, .01, .95)),
];

export default CAR_INFOS;
