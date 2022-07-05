import GameEntity from '../GameEntity.js';

class UiComponent extends GameEntity {
	input;

	constructor(input) {
		super();
		this.input = input;
	}
}

export default UiComponent;
