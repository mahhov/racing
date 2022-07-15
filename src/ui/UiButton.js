import Input from '../Input.js';
import UiComponent from './UiComponent.js';
import UiRect from './UiRect.js';
import UiText from './UiText.js';

class UiButton extends UiComponent {
	#centerX;
	#top;
	#width;
	#height;
	#backColor;
	#disabled = false;
	#state = UiButton.states.OFF;

	#text;
	#rect;

	static states = {
		OFF: 0, HOVER: 1, CLICK: 2,
	};

	constructor(input, text, centerX, top, width = .2, height = .04, backColor = '#000') {
		super(input);
		this.#centerX = centerX;
		this.#top = top;
		this.#width = width;
		this.#height = height;
		this.#backColor = backColor;

		this.#rect = this.addUiComponent(new UiRect(centerX - width / 2, top, width, height, backColor, '#fff'));
		this.#text = this.addUiComponent(new UiText(text, centerX, top + height / 2, 'center', 'middle', '#fff'));
	}

	set backColor(backColor) {
		this.#backColor = backColor;
	}

	set disabled(disabled) {
		this.#disabled = disabled;
	}

	get active() {
		return this.#state !== UiButton.states.OFF;
	}

	update() {
		super.update();

		if (UiComponent.mouseIn(this.input, this.#centerX - this.#width / 2, this.#top, this.#width, this.#height))
			this.#state = this.input.getMouseState(0) === Input.states.PRESSED && !this.#disabled ?
				UiButton.states.CLICK : UiButton.states.HOVER;
		else
			this.#state = UiButton.states.OFF;

		this.#rect.fillColor = this.#disabled ? '#333' : [this.#backColor, '#555', '#aaa'][this.#state];
		this.#text.color = this.#disabled ? '#999' : '#fff';

		if (this.#state === UiButton.states.CLICK)
			this.emit('click');
	}
}

export default UiButton;
