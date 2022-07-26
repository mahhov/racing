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
	#points = [];

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
				if (TrackEditorFrame.sameCoord(this.#downCoord, mouseCoord))
					this.#points.push(this.#downCoord);
				else {
					let i = this.#points.findIndex(point => TrackEditorFrame.sameCoord(point, this.#downCoord));
					if (i !== -1)
						this.#points.splice(i+1, 0, mouseCoord);
					this.#downCoord = null;
				}
			}
			if (this.input.getMouseState(2, true))
				this.#points = this.#points.filter(point => !TrackEditorFrame.sameCoord(point, mouseCoord));
		});
		this.addUiComponent(new UiButton(input, 'Back', .2, .92))
			.addListener('click', () => this.emit('back'));
		this.addUiComponent(new UiButton(input, 'Clear', .5, .92))
			.addListener('click', () => this.#points = []);
		this.addUiComponent(new UiButton(input, 'Export', .8, .92))
			.addListener('click', () =>
				console.log(this.#points
					.map(point => point.map(c => (this.#gridSize - c) * 100))
					.map(point => `.point(${point[0]}, 0, ${point[1]})`)
					.join('\n')));
	}

	static sameCoord(coord1, coord2) {
		return coord1.every((c, i) => c === coord2[i]);
	}

	update() {
		super.update();

		if (this.input.getMouseState(0) === Input.states.RELEASED)
			this.#downCoord = null;

		this.#texture.ctx.clearRect(0, 0, this.#canvasSize, this.#canvasSize);

		for (let x = 0; x < this.#gridSize; x++)
			for (let y = 0; y < this.#gridSize; y++)
				this.#drawPoint([x, y], '#fff');

		this.#points.forEach((point, i, a) =>
			this.#drawLine(point, a[(i + 1) % a.length], '#fff', 5));
		this.#points.forEach(point =>
			this.#drawPoint(point, '#00f'));
		if (this.#points.length)
			this.#drawPoint(this.#points[this.#points.length - 1], '#ff0');

		if (this.#downCoord)
			this.#drawLine(this.#downCoord, this.#curCoord, '#f00', 5);
		if (this.#curCoord)
			this.#drawPoint(this.#curCoord, '#f00');
	}

	#drawLine(point1, point2, color, width) {
		this.#texture.ctx.strokeStyle = color;
		this.#texture.ctx.lineWidth = width;
		this.#texture.ctx.beginPath();
		this.#texture.ctx.moveTo(...this.#gridToCanvasCoord(point1));
		this.#texture.ctx.lineTo(...this.#gridToCanvasCoord(point2));
		this.#texture.ctx.stroke();
	}

	#drawPoint(point, color) {
		this.#texture.ctx.fillStyle = color;
		this.#texture.ctx.fillRect(...this.#gridToCanvasCoord(point).map(c => c - 2), 4, 4);
	}

	get #space() {
		return (this.#canvasSize - this.#canvasMargin * 2) / (this.#gridSize - 1);
	}

	#floatToGridCoord(floatCoord) {
		// map [0, 1] to [0, gridSize]
		return floatCoord.map(c => Math.round((c * this.#canvasSize - this.#canvasMargin) * (this.#gridSize - 1) / (this.#canvasSize - this.#canvasMargin * 2)));
	}

	#gridToCanvasCoord(gridCoord) {
		// map [0, gridSize] to [0, canvasSize]
		return gridCoord.map(c => this.#canvasMargin + c * this.#space);
	}
}

export default TrackEditorFrame;
