import UiComponent from './UiComponent.js';

class UiText extends UiComponent {
	#text;
	#left;
	#textAlign;
	#bottom;
	#color;
	#font;

	constructor(text, left, bottom, textAlign, color, font) {
		super();
		this.#text = text;
		this.#left = left;
		this.#bottom = bottom;
		this.#textAlign = textAlign;
		this.#color = color;
		this.#font = font;
	}

	paintUi(ctx, width, height) {
		ctx.textAlign = this.#textAlign;
		ctx.fillStyle = this.#color;
		ctx.font = this.#font;
		ctx.fillText(this.#text, this.#left * width, this.#bottom * height);
	}
}

export default UiText;
