class Save {
	currency;
	tracksUnlocked;
	carsUnlocked;

	constructor(currency = 0, tracksUnlocked = [true], carsUnlocked = [true]) {
		this.currency = currency;
		this.tracksUnlocked = tracksUnlocked;
		this.carsUnlocked = carsUnlocked;
	}

	static load() {
		try {
			let data = JSON.parse(localStorage.getItem('save'));
			return new Save(data.currency, data.tracksUnlocked, data.carsUnlocked);
		} catch (e) {
			return new Save();
		}
	}

	save() {
		let data = JSON.stringify(this);
		localStorage.setItem('save', data);
	}
}

export default Save;

// to reset:
// new Save().save();
