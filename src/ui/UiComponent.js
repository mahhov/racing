import GameEntity from '../GameEntity.js';

class UiComponent extends GameEntity {
	input;
	#uiElements = [];

	constructor(input) {
		super();
		this.input = input;
	}

	add(uiElement) {
		this.#uiElements.push(uiElement);
		return uiElement;
	}

	update() {
		this.#uiElements.forEach(element => element.update());
	}

	paint() {
		this.#uiElements.forEach(element => element.paint());
	}

	paintUi(ctx, width, height) {
		this.#uiElements.forEach(element => element.paintUi(ctx, width, height));
	}
}

export default UiComponent;
