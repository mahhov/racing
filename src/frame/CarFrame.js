import CAR_INFOS from '../car/CarInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiText from '../ui/UiText.js';

class CarFrame extends UiComponent {
	#save;
	#currencyText;
	#helpText;

	constructor(input, save) {
		super(input);
		this.#save = save;
		CAR_INFOS.forEach((carInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, carInfo.name, .5, .3 + .06 * i));
			button.addListener('click', () => {
				if (!this.#save.carsUnlocked[i]) {
					this.#save.carsUnlocked[i] = true;
					this.#save.currency -= carInfo.cost;
					this.#save.save();
				}
				this.emit('select', carInfo);
			});
		});
		this.#currencyText = this.addUiComponent(new UiText('', .5, .5, 'center', 'bottom', '#fff'));
		this.#helpText = this.addUiComponent(new UiText('', .5, .56, 'center', 'bottom', '#fff'));
		this.addUiComponent(new UiText('Select car', .5, .2, 'center', 'bottom', '#fff', '60px arial'));
		this.addUiComponent(new UiButton(input, 'Select track', .15, .9)).addListener('click', () => this.emit('selectTrack'));
	}

	update() {
		super.update();
		CAR_INFOS.forEach((carInfo, i) => {
			this.uiComponents[i].disabled = !this.#save.carsUnlocked[i] && carInfo.cost > this.#save.currency;
			if (this.uiComponents[i].active) {
				this.#helpText.text = this.#save.carsUnlocked[i] ? '' : `\$${carInfo.cost} to unlock.`;
				// this.#preview.texture = trackInfo.track.texture;
			}
		});
		this.#currencyText.text = `Bank: \$${this.#save.currency}`;
	}
}

export default CarFrame;

// todo highlight selected, unlocked, locked
// todo show preview of stats
