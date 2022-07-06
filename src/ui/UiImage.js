import UiComponent from './UiComponent.js';

class UiImage extends UiComponent {
	#left;
	#top;
	#width;
	#height;
	#texture;

	constructor(input, left, top, width, height) {
		super(input);
		this.#left = left;
		this.#top = top;
		this.#width = width;
		this.#height = height;
	}

	set texture(texture) {
		this.#texture = texture;
	}

	update() {
		if (this.input) {
			let mouseCoord = UiComponent.mouseIn(this.input, this.#left, this.#top, this.#width, this.#height);
			if (mouseCoord)
				this.emit('mouse', mouseCoord);
		}
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
