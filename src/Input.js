class Input {
	#keys = [];

	constructor() {
		document.addEventListener('keydown', e => this.#keyDown(e));
		document.addEventListener('keyup', e => this.#keyUp(e));
	}

	#keyDown(e) {
		this.#keys[e.key] = true;
	}

	#keyUp(e) {
		this.#keys[e.key] = false;
	}

	get(key) {
		return this.#keys[key];
	}
}

export default Input;
