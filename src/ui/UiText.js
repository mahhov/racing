import UiComponent from './UiComponent.js';

class UiText extends UiComponent {
	#text;
	#left;
	#textAlign;
	#textVertAlign;
	#bottom;
	#color;
	#font;

	constructor(text, left, bottom, textAlign, textVertAlign, color, font = '20px arial') {
		super();
		this.#text = text;
		this.#left = left;
		this.#bottom = bottom;
		this.#textAlign = textAlign; // left, right, center
		this.#textVertAlign = textVertAlign; // top, middle, bottom
		this.#color = color;
		this.#font = font;
	}

	set text(text) {
		this.#text = text;
	}

	set color(color) {
		this.#color = color;
	}

	paintUi(uiTexture) {
		uiTexture.ctx.textAlign = this.#textAlign;
		uiTexture.ctx.textBaseline = this.#textVertAlign;
		uiTexture.ctx.fillStyle = this.#color;
		uiTexture.ctx.font = this.#font;
		uiTexture.ctx.fillText(this.#text, this.#left * uiTexture.width, this.#bottom * uiTexture.height);
	}
}

export default UiText;
