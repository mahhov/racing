import Input from '../Input.js';
import UiComponent from './UiComponent.js';
import UiRect from './UiRect.js';
import UiText from './UiText.js';

class UiButton extends UiComponent {
	#centerX;
	#top;
	#width;
	#height;
	#disabled = false;
	#state = UiButton.states.OFF;

	#text;
	#rect;

	static states = {
		OFF: 0, HOVER: 1, CLICK: 2,
	};

	constructor(input, text, centerX, top, width, height) {
		super(input);
		this.#centerX = centerX;
		this.#top = top;
		this.#width = width;
		this.#height = height;

		this.#rect = this.addUiComponent(new UiRect(centerX - width / 2, top, width, height, '#000', '#fff'));
		this.#text = this.addUiComponent(new UiText(text, centerX, top + height, 'center', '#fff'));
	}

	set disabled(disabled) {
		this.#disabled = disabled;
	}

	update() {
		super.update();
		if (this.#disabled) {
			this.#text.color = '#999';
			this.#rect.fillColor = '#333';
			return;
		}

		this.#text.color = '#fff';

		let mousePosition = this.input.getMousePosition();
		let dx = mousePosition[0] - this.#centerX + this.#width / 2;
		let dy = mousePosition[1] - this.#top;
		if (dx > 0 && dx < this.#width && dy > 0 && dy < this.#height)
			this.#state = this.input.getMouseState() === Input.states.PRESSED ? UiButton.states.CLICK : UiButton.states.HOVER;
		else
			this.#state = UiButton.states.OFF;
		this.#rect.fillColor = ['#000', '#555', '#aaa'][this.#state];
		if (this.#state === UiButton.states.CLICK)
			this.emit('click');
	}
}

export default UiButton;
