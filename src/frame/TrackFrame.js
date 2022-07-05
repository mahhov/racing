import TRACK_INFOS from '../TrackInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiText from '../ui/UiText.js';

class TrackFrame extends UiComponent {
	#save;
	#helpText;

	constructor(input, save) {
		super(input);
		this.#save = save;
		TRACK_INFOS.forEach((trackInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, trackInfo.name, .5, .3 + .06 * i, .2, .04));
			button.addListener('click', () => this.emit('select', trackInfo));
			button.disabled = !save.tracksUnlocked[i];
		});
		this.#helpText = this.addUiComponent(new UiText('', .5, .7, 'center', '#fff'));
	}

	update() {
		super.update();
		this.#helpText.text = '';
		TRACK_INFOS.forEach((trackInfo, i) => {
			this.uiComponents[i].disabled = !this.#save.tracksUnlocked[i];
			if (this.uiComponents[i].active)
				this.#helpText.text = this.#save.tracksUnlocked[i] ?
					`Reward: ${trackInfo.currencyReward}` :
					'Complete the previous tracks to unlock.';
		});

	}
}

export default TrackFrame;
