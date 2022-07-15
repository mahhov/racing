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

	paintUi(uiTexture) {
		if (this.#texture)
			uiTexture.ctx.drawImage(this.#texture.canvas,
				this.#left * uiTexture.width,
				this.#top * uiTexture.height,
				this.#width * uiTexture.width,
				this.#height * uiTexture.height);
	}
}

export default UiImage;
