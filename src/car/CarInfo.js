class CarParams {
	acceleration;

	constructor(acceleration) {
		this.acceleration = acceleration;
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
	new CarInfo('Child', 0, new CarParams(.1)),
	new CarInfo('Power', 1000, new CarParams(.3)),
];

export default CAR_INFOS;
