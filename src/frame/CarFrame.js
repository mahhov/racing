import CAR_INFOS from '../car/CarInfo.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';
import UiText from '../ui/UiText.js';

class CarFrame extends UiComponent {
	#save;
	#carSelected = 0;
	#currencyText;
	#helpText;
	#carParamsTexts;

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
				this.#carSelected = i;
				this.emit('select', carInfo);
			});
		});
		this.#currencyText = this.addUiComponent(new UiText('', .5, .56, 'center', 'bottom', '#fff'));
		this.#helpText = this.addUiComponent(new UiText('', .5, .62, 'center', 'bottom', '#fff'));
		this.#carParamsTexts = CAR_INFOS[0].carParams.uiTextArray.map((_, i) =>
			this.addUiComponent(new UiText('', .5, .68 + i * .06, 'center', 'bottom', '#fff')));
		this.addUiComponent(new UiText('Select car', .5, .2, 'center', 'bottom', '#fff', '60px arial'));
		this.addUiComponent(new UiButton(input, 'Select track', .15, .9)).addListener('click', () => this.emit('selectTrack'));
	}

	update() {
		super.update();
		this.#helpText.text = '';
		this.#carParamsTexts.forEach(carParamsText => carParamsText.text = '');
		CAR_INFOS.forEach((carInfo, i) => {
			this.uiComponents[i].backColor = i === this.#carSelected ? '#333' : this.#save.carsUnlocked[i] ? '#000' : '#f00';
			this.uiComponents[i].disabled = !this.#save.carsUnlocked[i] && carInfo.cost > this.#save.currency;
			if (this.uiComponents[i].active) {
				this.#helpText.text = this.#save.carsUnlocked[i] ? '' : `\$${carInfo.cost} to unlock.`;
				CAR_INFOS[i].carParams.uiTextArray.forEach((text, i) =>
					this.#carParamsTexts[i].text = text);
			}
		});
		this.#currencyText.text = `Bank: \$${this.#save.currency}`;
	}
}

export default CarFrame;

// todo show preview of stats
