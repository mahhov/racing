import UiEntity from './UiEntity.js';

class GameEntity extends UiEntity {
	mesh;

	constructor(mesh) {
		super();
		this.mesh = mesh;
	}

	paint() {
	}
}

export default GameEntity;
