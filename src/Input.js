class Input {
	#canvas;

	static states = {
		UP: 0, PRESSED: 1, DOWN: 2, RELEASED: 3,
	};

	#keys = {};
	#mouseState = Input.states.UP;
	#mousePosition = [0, 0];

	constructor(canvas) {
		this.#canvas = canvas;
		document.addEventListener('keydown', e => this.#keyDown(e));
		document.addEventListener('keyup', e => this.#keyUp(e));
		canvas.addEventListener('mousedown', e => this.#mouseDown(e));
		canvas.addEventListener('mouseup', e => this.#mouseUp(e));
		canvas.addEventListener('mousemove', e => this.#mouseMove(e));
	}

	#keyDown(e) {
		if (!e.repeat)
			this.#keys[e.key.toLowerCase()] = Input.states.PRESSED;
	}

	#keyUp(e) {
		this.#keys[e.key.toLowerCase()] = Input.states.RELEASED;
	}

	#mouseDown(e) {
		this.#mouseState = Input.states.PRESSED;
	}

	#mouseUp(e) {
		this.#mouseState = Input.states.RELEASED;
	}

	#mouseMove(e) {
		this.#mousePosition = [(e.x - this.#canvas.offsetLeft) / this.#canvas.width, (e.y - this.#canvas.offsetTop) / this.#canvas.height];
	}

	update() {
		Object.entries(this.#keys).forEach(([key, state]) =>
			this.#keys[key] = Input.updateState(state));
		this.#mouseState = Input.updateState(this.#mouseState);
	}

	static updateState(state) {
		if (state === Input.states.PRESSED)
			return Input.states.DOWN;
		if (state === Input.states.RELEASED)
			return Input.states.UP;
		return state;
	}

	getKey(key, asBool = false) {
		return Input.getState(this.#keys[key], asBool);
	}

	getMouseState(asBool = false) {
		return Input.getState(this.#mouseState, asBool);
	}

	static getState(state, asBool) {
		return asBool ? state === Input.states.PRESSED || state === Input.states.DOWN : state;
	}

	getMousePosition() {
		return this.#mousePosition;
	}
}

export default Input;
