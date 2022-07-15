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

		this.addUiComponent(new UiRect(0, 0, 1, 1, 'rgba(0,0,0,.5)', null));
		this.addUiComponent(new UiText('Paused', .5, .35, 'center','bottom', '#fff', '60px arial'));
		this.addUiComponent(new UiButton(input, 'Resume', .5, .4))
			.addListener('click', () => this.emit('resume'));
		this.addUiComponent(new UiButton(input, 'Abandon', .5, .46))
			.addListener('click', () => this.emit('abandon'));
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('resume');
		super.update();
	}

	paintUi(uiTexture) {
		this.#gameFrame.paintUi(uiTexture);
		super.paintUi(uiTexture);
	}
}

export default PauseFrame;
