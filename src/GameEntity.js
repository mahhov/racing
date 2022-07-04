import Emitter from './util/Emitter.js';

class GameEntity extends Emitter {
	mesh;

	constructor(mesh = null) {
		super();
		this.mesh = mesh;
	}

	update() {
		// return true if expired
	}

	paint() {
	}

	paintUi(ctx, width, height) {
	}
}

export default GameEntity;
