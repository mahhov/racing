import GameEntity from '../GameEntity.js';

class UiComponent extends GameEntity {
	input;

	constructor(input = null) {
		super();
		this.input = input;
	}
}

export default UiComponent;
