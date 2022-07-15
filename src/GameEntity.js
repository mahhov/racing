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

	paintUi(uiTexture) {
		this.uiComponents.forEach(uiComponent => uiComponent.paintUi(uiTexture));
	}
}

export default GameEntity;
