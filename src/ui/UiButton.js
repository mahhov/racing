import UiComponent from './UiComponent.js';
import UiRect from './UiRect.js';
import UiText from './UiText.js';

class UiButton extends UiComponent {
	#text;
	#left;
	#top;
	#width;
	#height;

	#clicked = false;

	constructor(text, left, top, width, height) {
		super();
		this.#text = text;
		this.#left = left;
		this.#top = top;
		this.#width = width;
		this.#height = height;

		this.addUiComponent(new UiRect(left - width / 2, top, width, height, '#000', '#fff'));
		this.addUiComponent(new UiText(text, left, top + height, 'center', '#fff', '30px arial'));
	}

	update() {
		super.update();
	}
}

export default UiButton;
