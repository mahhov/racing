import GameEntity from '../GameEntity.js';

class Frame extends GameEntity {
	input;
	#listeners = {};

	constructor(input) {
		super();
		this.input = input;
	}

	addListener(event, handler) {
		this.#listeners[event] ||= [];
		this.#listeners[event].push(handler);
	}

	emit(event, ...args) {
		this.#listeners[event]?.forEach(handler => handler(...args));
	}
}

export default Frame;
