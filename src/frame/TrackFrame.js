import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';

class TrackFrame extends UiComponent {
	constructor(input) {
		super(input);
		for (let i = 0; i < 4; i++) {
			this.addUiComponent(new UiButton(input, `Track ${i}`, .5, .3 + .06 * i, .2, .04))
				.addListener('click', () => this.emit('select', i));
		}
	}
}

export default TrackFrame;
