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
	new TrackInfo('B', Track.trackB(), 500),
	new TrackInfo('X', Track.trackX(), 1000),
	new TrackInfo('Square', Track.trackSquare(), 3000),
	new TrackInfo('Jump', Track.trackJumps(), 0),
];

export default TRACK_INFOS;
