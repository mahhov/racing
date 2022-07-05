import TRACK_INFOS from '../TrackInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';

class TrackFrame extends UiComponent {
	#save;

	constructor(input, save) {
		super(input);
		this.#save = save;
		TRACK_INFOS.forEach((trackInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, trackInfo.name, .5, .3 + .06 * i, .2, .04));
			button.addListener('click', () => this.emit('select', trackInfo));
			button.disabled = !save.tracksUnlocked[i];
		});
	}

	update() {
		super.update();
		TRACK_INFOS.forEach((trackInfo, i) => {
			let button = this.uiComponents[i];
			button.disabled = !this.#save.tracksUnlocked[i];
		});
	}
}

export default TrackFrame;
