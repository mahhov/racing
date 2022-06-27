class PerSecondCount {
	#start = 0;
	#count = 0;

	add() {
		this.#count++;
	}

	elapsedSecond(now) {
		return now - this.#start > 1000;
	}

	get count() {
		return this.#count;
	}

	reset(now) {
		this.#count = 0;
		this.#start = now;
	}

	log(text, now = Date.now()) {
		if (this.elapsedSecond(now)) {
			// console.log(`${text} per second ${this.count}`);
			this.reset(now);
		}
	}
}

export default PerSecondCount;
