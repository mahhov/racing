class GameEntity {
	static #count = 0;
	id = GameEntity.#count++;
	mesh;

	constructor(mesh) {
		this.mesh = mesh;
	}

	update() {
	}

	paint() {
	}
}

export default GameEntity;
