import UiEntity from '../UiEntity.js';

class Frame extends UiEntity {
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
