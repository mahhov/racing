import Track from '../Track.js';
import UiButton from '../ui/UiButton.js';
import UiComponent from '../ui/UiComponent.js';

class TrackInfo {
	track;
	name;

	constructor(track, name) {
		this.track = track;
		this.name = name;
	}
}

let trackInfos = [
	new TrackInfo(Track.trackSquare(), 'Square'),
	new TrackInfo(Track.trackB(), 'B'),
];

class TrackFrame extends UiComponent {
	constructor(input) {
		super(input);
		trackInfos.forEach((trackInfo, i)=>{
			this.addUiComponent(new UiButton(input, trackInfo.name, .5, .3 + .06 * i, .2, .04))
				.addListener('click', () => this.emit('select', trackInfo.track));
		})
	}
}

export default TrackFrame;
