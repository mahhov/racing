import Track from './Track.js';

class TrackInfo {
	name;
	track;
	currencyReward;

	constructor(name, track, currencyReward) {
		this.name = name;
		this.track = track;
		this.currencyReward = currencyReward;
	}
}

const TRACK_INFOS = [
	new TrackInfo('B', Track.trackB(), 300),
	new TrackInfo('Square', Track.trackSquare(), 1000),
];

export default TRACK_INFOS;
