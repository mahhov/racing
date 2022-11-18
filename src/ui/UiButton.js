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
	#selected = false;
	#disabled = false;
	#mouseState = UiButton.mouseState.OFF;

	#text;
	#rect;

	static mouseState = {
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

	set selected(selected) {
		this.#selected = selected;
	}

	set disabled(disabled) {
		this.#disabled = disabled;
	}

	get active() {
		return this.#mouseState !== UiButton.mouseState.OFF;
	}

	set enlarge(enlarge) {
		this.#rect.left = this.#centerX - this.#width / 2 - enlarge / 2;
		this.#rect.width = this.#width + enlarge;
	}

	update() {
		super.update();

		if (!UiComponent.mouseIn(this.input, this.#centerX - this.#width / 2, this.#top, this.#width, this.#height))
			this.#mouseState = UiButton.mouseState.OFF;
		else if (this.#disabled)
			this.#mouseState = UiButton.mouseState.HOVER;
		else if (this.input.getMouseState(0) === Input.states.PRESSED)
			this.#mouseState = UiButton.mouseState.CLICK;
		else if (this.input.getMouseState(0) === Input.states.DOWN)
			this.#mouseState = UiButton.mouseState.PRESSED;
		else
			this.#mouseState = UiButton.mouseState.HOVER;

		if (this.#disabled)
			this.#rect.fillColor = '#333';
		else if (this.#selected)
			this.#rect.fillColor = '#ad2d2d';
		else
			this.#rect.fillColor = [this.#backColor, '#ad2d2d', '#aaa', '#aaa'][this.#mouseState];

		this.enlarge = this.active ? .03 : 0;

		this.#text.color = this.#disabled ? '#999' : '#fff';

		if (this.#mouseState === UiButton.mouseState.CLICK)
			this.emit('click');
	}
}

export default UiButton;
