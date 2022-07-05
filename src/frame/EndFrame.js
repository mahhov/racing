import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiRect from '../ui/UiRect.js';
import UiText from '../ui/UiText.js';

class EndFrame extends UiComponent {
	#gameFrame;
	#text;

	constructor(input, gameFrame) {
		super(input);
		this.#gameFrame = gameFrame;

		this.addUiComponent(new UiRect(0, 0, 1, 1, 'rgba(0,0,0,.5)', null));
		this.#text = this.addUiComponent(new UiText('', .5, .35, 'center', '#fff', '60px arial'));
		this.addUiComponent(new UiButton(input, 'Back', .5, .4, .2, .04))
			.addListener('click', () => this.emit('back'));
	}

	setEnd(win) {
		this.#text.text = win ? 'Victory' : 'Loss';
	}

	paintUi(ctx, width, height) {
		this.#gameFrame.paintUi(ctx, width, height);
		super.paintUi(ctx, width, height);
	}
}

export default EndFrame;
