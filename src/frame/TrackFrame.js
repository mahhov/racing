import TRACK_INFOS from '../track/TrackInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiImage from '../ui/UiImage.js';
import UiText from '../ui/UiText.js';

class TrackFrame extends UiComponent {
	#save;
	#carText;
	#helpText;
	#preview;

	constructor(input, save) {
		super(input);
		this.#save = save;
		TRACK_INFOS.forEach((trackInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, trackInfo.name, .5, .3 + .06 * i));
			button.addListener('click', () => this.emit('select', trackInfo));
		});
		this.addUiComponent(new UiText('Select track', .5, .2, 'center', 'bottom', '#fff', '60px arial'));
		this.#helpText = this.addUiComponent(new UiText('', .5, .56, 'center', 'bottom', '#fff'));
		this.#preview = this.addUiComponent(new UiImage(null, .35, .6, .3, .3));
		this.#carText = this.addUiComponent(new UiText('', .15, .88, 'center', 'bottom', '#fff'));
		this.addUiComponent(new UiButton(input, 'Select car', .15, .9)).addListener('click', () => this.emit('selectCar'));
		this.addUiComponent(new UiButton(input, 'Editor', .85, .9)).addListener('click', () => this.emit('editor'));
	}

	set carText(text) {
		this.#carText.text = text;
	}

	update() {
		super.update();
		this.#helpText.text = '';
		this.#preview.texture = null;
		TRACK_INFOS.forEach((trackInfo, i) => {
			this.uiComponents[i].disabled = !this.#save.tracksUnlocked[i];
			if (this.uiComponents[i].active) {
				this.#helpText.text = this.#save.tracksUnlocked[i] ?
					`Reward: ${trackInfo.reward}` :
					'Complete the previous tracks to unlock.';
				this.#preview.texture = trackInfo.track.texture;
			}
		});
	}
}

export default TrackFrame;
