import UiComponent from './UiComponent.js';

class UiImage extends UiComponent {
	#left;
	#top;
	#width;
	#height;
	#texture;

	constructor(left, top, width, height) {
		super();
		this.#left = left;
		this.#top = top;
		this.#width = width;
		this.#height = height;
	}

	set texture(texture) {
		this.#texture = texture;
	}

	paintUi(ctx, width, height) {
		if (this.#texture)
			ctx.drawImage(this.#texture.canvas,
				this.#left * width,
				this.#top * height,
				this.#width * width,
				this.#height * height);
	}
}

export default UiImage;
