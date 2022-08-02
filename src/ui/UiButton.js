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
		OFF: 0, HOVER: 1, CLICK: 2, PRESSED: 3,
	};

	constructor(input, text, centerX, top, width = .2, height = .04, backColor = '#000') {
		super(input);
		this.#centerX = centerX;
		this.#top = top;
		this.#width = width;
		this.#height = height;
		this.#backColor = backColor;

		this.#rect = this.addUiComponent(new UiRect(0, top, 0, height, backColor, '#fff'));
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

	set enlarge(enlarge) {
		this.#rect.left = this.#centerX - this.#width / 2 - enlarge / 2;
		this.#rect.width = this.#width + enlarge;
	}

	update() {
		super.update();

		if (UiComponent.mouseIn(this.input, this.#centerX - this.#width / 2, this.#top, this.#width, this.#height))
			if (this.input.getMouseState(0) === Input.states.PRESSED && !this.#disabled)
				this.#state = UiButton.states.CLICK;
			else if (this.input.getMouseState(0) === Input.states.DOWN && !this.#disabled)
				this.#state = UiButton.states.PRESSED;
			else
				this.#state = UiButton.states.HOVER;
		else
			this.#state = UiButton.states.OFF;

		this.#rect.fillColor = this.#disabled ? '#333' : [this.#backColor, '#ad2d2d', '#aaa', '#aaa'][this.#state];
		this.enlarge = this.#state === UiButton.states.OFF ? 0 : .03;

		this.#text.color = this.#disabled ? '#999' : '#fff';

		if (this.#state === UiButton.states.CLICK)
			this.emit('click');
	}
}

export default UiButton;
