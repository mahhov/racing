class Input {
	static states = {
		UP: 0, PRESSED: 1, DOWN: 2, RELEASED: 3,
	};

	#keys = {};

	constructor() {
		document.addEventListener('keydown', e => this.#keyDown(e));
		document.addEventListener('keyup', e => this.#keyUp(e));
	}

	#keyDown(e) {
		this.#keys[e.key] = Input.states.PRESSED;
	}

	#keyUp(e) {
		this.#keys[e.key] = Input.states.RELEASED;
	}

	update() {
		Object.entries(this.#keys).forEach(([key, state]) => {
			if (state === Input.states.PRESSED)
				state = Input.states.DOWN;
			else if (state === Input.states.RELEASED)
				state = Input.states.UP;
			this.#keys[key] = state;
		});
	}

	getKey(key, bool = false) {
		return bool ? this.#keys[key] === Input.states.PRESSED || this.#keys[key] === Input.states.DOWN : this.#keys[key];
	}
}

export default Input;
