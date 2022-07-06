class Input {
	#canvas;

	static states = {
		UP: 0, PRESSED: 1, DOWN: 2, RELEASED: 3,
	};

	#keys = {};
	#mouseStates = {};
	#mousePosition = [0, 0];

	constructor(canvas) {
		this.#canvas = canvas;
		document.addEventListener('keydown', e => this.#keyDown(e));
		document.addEventListener('keyup', e => this.#keyUp(e));
		canvas.addEventListener('mousedown', e => this.#mouseDown(e));
		canvas.addEventListener('mouseup', e => this.#mouseUp(e));
		canvas.addEventListener('mousemove', e => this.#mouseMove(e));
		document.addEventListener('contextmenu', e => e.preventDefault());
	}

	#keyDown(e) {
		if (!e.repeat)
			this.#keys[e.key.toLowerCase()] = Input.states.PRESSED;
	}

	#keyUp(e) {
		this.#keys[e.key.toLowerCase()] = Input.states.RELEASED;
	}

	#mouseDown(e) {
		this.#mouseStates[e.button] = Input.states.PRESSED;
	}

	#mouseUp(e) {
		this.#mouseStates[e.button] = Input.states.RELEASED;
	}

	#mouseMove(e) {
		this.#mousePosition = [(e.x - this.#canvas.offsetLeft) / this.#canvas.width, (e.y - this.#canvas.offsetTop) / this.#canvas.height];
	}

	update() {
		Object.entries(this.#keys).forEach(([key, state]) =>
			this.#keys[key] = Input.updateState(state));
		Object.entries(this.#mouseStates).forEach(([button, state]) =>
			this.#mouseStates[button] = Input.updateState(state));
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

	getMouseState(button, asBool = false) {
		// 0 = left, 1 = middle, 2 = right
		return Input.getState(this.#mouseStates[button], asBool);
	}

	static getState(state, asBool) {
		return asBool ? state === Input.states.PRESSED || state === Input.states.DOWN : state;
	}

	getMousePosition() {
		return this.#mousePosition;
	}
}

export default Input;
