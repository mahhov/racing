import GameEntity from '../GameEntity.js';

class UiComponent extends GameEntity {
	input;

	constructor(input = null) {
		super();
		this.input = input;
	}

	static mouseIn(input, left, top, width, height) {
		let mousePosition = input.getMousePosition();
		let dx = (mousePosition[0] - left) / width;
		let dy = (mousePosition[1] - top) / height;
		return dx > 0 && dx < 1 && dy > 0 && dy < 1 ? [dx, dy] : null;
	}
}

export default UiComponent;
