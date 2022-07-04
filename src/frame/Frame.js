import GameEntity from '../GameEntity.js';

class Frame extends GameEntity {
	input;

	constructor(input) {
		super();
		this.input = input;
	}
}

export default Frame;
