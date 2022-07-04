class GameEntity {
	mesh;

	constructor(mesh = null) {
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
