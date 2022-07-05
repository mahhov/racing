import UiComponent from './UiComponent.js';

class UiRect extends UiComponent {
	#left;
	#top;
	#width;
	#height;
	#fillColor;
	#outlineColor;

	constructor(left, top, width, height, fillColor,outlineColor) {
		super();
		this.#left = left;
		this.#top = top;
		this.#width = width;
		this.#height = height;
		this.#fillColor = fillColor;
		this.#outlineColor = outlineColor;
	}

	paintUi(ctx, width, height) {
		if (this.#fillColor) {
			ctx.fillStyle = this.#fillColor;
			ctx.fillRect(this.#left * width, this.#top * height, this.#width * width, this.#height * height);
		}
		if (this.#outlineColor) {
			ctx.strokeStyle = this.#outlineColor;
			ctx.strokeRect(this.#left * width, this.#top * height, this.#width * width, this.#height * height);
		}
	}
}

export default UiRect;
