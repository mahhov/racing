import Emitter from './util/Emitter.js';

class GameEntity extends Emitter {
	mesh;
	uiComponents = [];

	constructor(mesh = null) {
		super();
		this.mesh = mesh;
	}

	addUiComponent(uiComponent) {
		this.uiComponents.push(uiComponent);
		return uiComponent;
	}

	update() {
		this.uiComponents.forEach(uiComponent => uiComponent.update());
		// return true if expired
	}

	paintUi(ctx, width, height) {
		this.uiComponents.forEach(uiComponent => uiComponent.paintUi(ctx, width, height));
	}
}

export default GameEntity;
