import UiComponent from './UiComponent.js';

class UiRect extends UiComponent {
	#left;
	#top;
	#width;
	#height;
	#fillColor;
	#outlineColor;

	constructor(left, top, width, height, fillColor, outlineColor) {
		super();
		this.#left = left;
		this.#top = top;
		this.#width = width;
		this.#height = height;
		this.#fillColor = fillColor;
		this.#outlineColor = outlineColor;
	}

	set fillColor(fillColor) {
		this.#fillColor = fillColor;
	}

	paintUi(ctx, width, height) {
		if (this.#fillColor) {
			ctx.fillStyle = this.#fillColor;
			ctx.fillRect(this.#left * width, this.#top * height, this.#width * width, this.#height * height);
		}
		if (this.#outlineColor) {
			ctx.fillStyle = this.#outlineColor;
			let l = this.#left * width;
			let t = this.#top * height;
			let w = this.#width * width;
			let h = this.#height * height;
			let thickness = 2;
			ctx.fillRect(l - thickness, t, thickness, h); // left
			ctx.fillRect(l, t - thickness, w, thickness); // top
			ctx.fillRect(l + w, t, thickness, h); // right
			ctx.fillRect(l, t + h, w, thickness); // bottom
		}
	}
}

export default UiRect;
