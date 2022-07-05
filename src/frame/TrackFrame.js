import Track from '../Track.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';

class TrackInfo {
	track;
	name;
	locked;

	constructor(track, name, locked = true) {
		this.track = track;
		this.name = name;
		this.locked = locked;
	}
}

let trackInfos = [
	new TrackInfo(Track.trackB(), 'B', false),
	new TrackInfo(Track.trackSquare(), 'Square'),
];

class TrackFrame extends UiComponent {
	constructor(input) {
		super(input);
		trackInfos.forEach((trackInfo, i) => {
			let button = this.addUiComponent(new UiButton(input, trackInfo.name, .5, .3 + .06 * i, .2, .04));
			button.addListener('click', () => this.emit('select', trackInfo.track));
			button.disabled = trackInfo.locked;
		});
	}
}

export default TrackFrame;
