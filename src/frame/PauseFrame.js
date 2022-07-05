import Input from '../Input.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiRect from '../ui/UiRect.js';
import UiText from '../ui/UiText.js';

class PauseFrame extends UiComponent {
	#gameFrame;

	constructor(input, gameFrame) {
		super(input);
		this.#gameFrame = gameFrame;

		this.add(new UiRect(0, 0, 1, 1, 'rgba(0,0,0,.5)', null));
		this.add(new UiText('Paused', .5, .35, 'center', '#fff', '60px arial'));
		this.add(new UiButton('Resume', .5, .7, .2, .05))
			.addListener('click', () => this.emit('resume'));
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('resume');
		super.update();
	}

	paint() {
		this.#gameFrame.paint();
		super.paint();
	}

	paintUi(ctx, width, height) {
		this.#gameFrame.paintUi(ctx, width, height);
		super.paintUi(ctx, width, height);
	}
}

export default PauseFrame;
