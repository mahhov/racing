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

	paintUi(uiTexture) {
		if (this.#fillColor) {
			uiTexture.ctx.fillStyle = this.#fillColor;
			uiTexture.ctx.fillRect(
				this.#left * uiTexture.width,
				this.#top * uiTexture.height,
				this.#width * uiTexture.width,
				this.#height * uiTexture.height);
		}
		if (this.#outlineColor) {
			uiTexture.ctx.fillStyle = this.#outlineColor;
			let l = this.#left * uiTexture.width;
			let t = this.#top * uiTexture.height;
			let w = this.#width * uiTexture.width;
			let h = this.#height * uiTexture.height;
			let thickness = 2;
			uiTexture.ctx.fillRect(l - thickness, t, thickness, h); // left
			uiTexture.ctx.fillRect(l, t - thickness, w, thickness); // top
			uiTexture.ctx.fillRect(l + w, t, thickness, h); // right
			uiTexture.ctx.fillRect(l, t + h, w, thickness); // bottom
		}
	}
}

export default UiRect;
