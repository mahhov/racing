import UiComponent from './UiComponent.js';

class UiText extends UiComponent {
	#text;
	#left;
	#textAlign;
	#bottom;
	#color;
	#font;

	constructor(text, left, bottom, textAlign, color, font = '20px arial') {
		super();
		this.#text = text;
		this.#left = left;
		this.#bottom = bottom;
		this.#textAlign = textAlign;
		this.#color = color;
		this.#font = font;
	}

	set text(text) {
		this.#text = text;
	}

	set color(color) {
		this.#color = color;
	}

	paintUi(ctx, width, height) {
		ctx.textAlign = this.#textAlign;
		ctx.fillStyle = this.#color;
		ctx.font = this.#font;
		ctx.fillText(this.#text, this.#left * width, this.#bottom * height);
	}
}

export default UiText;
