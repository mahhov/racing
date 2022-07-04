class Emitter {
	#listeners = {};

	addListener(event, handler) {
		this.#listeners[event] ||= [];
		this.#listeners[event].push(handler);
	}

	emit(event, ...args) {
		this.#listeners[event]?.forEach(handler => handler(...args));
	}
}

export default Emitter;
