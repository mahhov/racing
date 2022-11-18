import CAR_INFOS from '../car/CarInfo.js';
import TRACK_INFOS from '../track/TrackInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiImage from '../ui/UiImage.js';
import UiText from '../ui/UiText.js';

const BUTTON_CENTER_X = .15;
const BUTTON_TOP = .1;
const BUTTON_ROW_HEIGHT = .06;
const PREVIEW_SIZE = .4;

let getY = i => BUTTON_TOP + BUTTON_ROW_HEIGHT * i;

class TrackAndCarFrame extends UiComponent {
	#save;
	#selectedTrackIndex = 0;
	#selectedCarIndex = 0;

	#trackButtons;
	#preview;
	#helpText;
	#carButtons;

	constructor(input, save) {
		super(input);
		this.#save = save;

		this.#trackButtons = TRACK_INFOS.map((trackInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, trackInfo.name, BUTTON_CENTER_X, getY(i)));
			button.addListener('click', () =>
				this.#updateSelectedButton(this.#trackButtons, this.#selectedTrackIndex = i));
			return button;
		});
		this.#updateSelectedButton(this.#trackButtons, this.#selectedTrackIndex);
		this.addUiComponent(new UiButton(input, 'Editor', BUTTON_CENTER_X, getY(TRACK_INFOS.length + 1)))
			.addListener('click', () => this.emit('editor'));

		this.#preview = this.addUiComponent(new UiImage(null, .5 - PREVIEW_SIZE / 2, getY(.5), PREVIEW_SIZE, PREVIEW_SIZE));
		this.#helpText = this.addUiComponent(new UiText('', .5, getY(.5) + PREVIEW_SIZE + BUTTON_ROW_HEIGHT, 'center', 'bottom', '#fff'));

		this.#carButtons = CAR_INFOS.map((carInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, carInfo.name, 1 - BUTTON_CENTER_X, getY(i)));
			button.addListener('click', () => {
				if (!this.#save.carsUnlocked[i]) {
					this.#save.carsUnlocked[i] = true;
					this.#save.currency -= carInfo.cost;
					this.#save.save();
				}
				this.#updateSelectedButton(this.#carButtons, this.#selectedCarIndex = i);
			});
			return button;
		});
		this.#updateSelectedButton(this.#carButtons, this.#selectedCarIndex);
	}

	#updateSelectedButton(buttons, index) {
		buttons.forEach((button, i) => button.selected = i === index);
	}

	update() {
		super.update();

		TRACK_INFOS.forEach((trackInfo, i) =>
			this.#trackButtons[i].disabled = !this.#save.tracksUnlocked[i]);

		CAR_INFOS.forEach((carInfo, i) =>
			this.#carButtons[i].disabled = !this.#save.carsUnlocked[i] && carInfo.cost > this.#save.currency);

		let index = this.#trackButtons.findIndex(button => button.active);
		if (index === -1)
			index = this.#selectedTrackIndex;
		this.#helpText.text = this.#save.tracksUnlocked[index] ?
			`Reward: ${TRACK_INFOS[index].reward}` :
			'Complete the previous tracks to unlock.';
		this.#preview.texture = TRACK_INFOS[index].track.texture;
	}
}

export default TrackAndCarFrame;
