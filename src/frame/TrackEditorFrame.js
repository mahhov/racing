import Input from '../Input.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiImage from '../ui/UiImage.js';
import UiRect from '../ui/UiRect.js';
import DynamicTexture from '../util/DynamicTexture.js';

class TrackEditorFrame extends UiComponent {
	#canvasSize = 400;
	#canvasMargin = 20;
	#gridSize = 15;

	#preview;
	#texture = new DynamicTexture(this.#canvasSize, this.#canvasSize);

	#downCoord = null;
	#curCoord = null;
	#lines = [];

	constructor(input) {
		super(input);
		this.addUiComponent(new UiRect(.1, .1, .8, .8, null, '#fff'));
		this.#preview = this.addUiComponent(new UiImage(input, .1, .1, .8, .8));
		this.#preview.texture = this.#texture;
		this.#preview.addListener('mouse', mouseCoord => {
			mouseCoord = this.#floatToGridCoord(mouseCoord);
			this.#curCoord = mouseCoord;
			if (this.input.getMouseState(0) === Input.states.PRESSED)
				this.#downCoord = mouseCoord;
			else if (this.input.getMouseState(0) === Input.states.RELEASED) {
				this.#lines.push([this.#downCoord, mouseCoord]);
				this.#downCoord = null;
			}
			if (this.input.getMouseState(2, true))
				this.#lines = this.#lines.filter(line =>
					line.every(xy => xy.some((c, i) => c !== mouseCoord[i])));
		});
		this.addUiComponent(new UiButton(input, 'Back', .5, .92))
			.addListener('click', () => this.emit('back'));
	}

	update() {
		super.update();

		if (this.input.getMouseState(0) === Input.states.RELEASED)
			this.#downCoord = null;

		this.#texture.ctx.clearRect(0, 0, this.#canvasSize, this.#canvasSize);

		this.#texture.ctx.fillStyle = '#fff';
		for (let x = 0; x < this.#gridSize; x++)
			for (let y = 0; y < this.#gridSize; y++)
				this.#texture.ctx.fillRect(...this.#gridToCanvasCoord([x, y]).map(c => c - 2), 4, 4);

		this.#texture.ctx.lineWidth = 5;
		if (this.#lines.length) {
			this.#texture.ctx.strokeStyle = '#fff';
			this.#texture.ctx.beginPath();
			this.#lines.forEach(line => {
				this.#texture.ctx.moveTo(...this.#gridToCanvasCoord(line[0]));
				this.#texture.ctx.lineTo(...this.#gridToCanvasCoord(line[1]));
			});
			this.#texture.ctx.stroke();
		}

		if (this.#downCoord) {
			this.#texture.ctx.strokeStyle = '#f00';
			this.#texture.ctx.beginPath();
			this.#texture.ctx.moveTo(...this.#gridToCanvasCoord(this.#downCoord));
			this.#texture.ctx.lineTo(...this.#gridToCanvasCoord(this.#curCoord));
			this.#texture.ctx.stroke();
		} else if (this.#curCoord) {
			this.#texture.ctx.fillStyle = '#f00';
			this.#texture.ctx.fillRect(...this.#gridToCanvasCoord(this.#curCoord).map(c => c - 2), 4, 4);
		}
	}

	get #space() {
		return (this.#canvasSize - this.#canvasMargin * 2) / (this.#gridSize - 1);
	}

	#floatToGridCoord(floatCoord) {
		// map [0, 1] to [0, gridSize]
		return floatCoord.map(c => Math.round((c - this.#canvasMargin / this.#canvasSize) * this.#gridSize));
	}

	#gridToCanvasCoord(gridCoord) {
		// map [0, gridSize] to [0, canvasSize]
		return gridCoord.map(c => this.#canvasMargin + c * this.#space);
	}
}

export default TrackEditorFrame;
