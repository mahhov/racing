import * as THREE from 'three';
import SegmentCreator from './SegmentCreator.js';
import Track from './Track.js';

class TrackInfo {
	name;
	reward;
	track;

	constructor(name, reward, track) {
		this.name = name;
		this.reward = reward;
		this.track = track;
	}
}

let createTrackB = () => {
	let segments = new SegmentCreator()
		.lineAt(100, 200, 100, 500, 30)
		.lineAt(200, 600, 500, 600)
		.lineAt(600, 500, 600, 200)
		.lineAt(500, 100, 200, 100)
		.done();
	return new Track(700, 300, 700, segments, new THREE.Vector3(100, 0, 300));
};

let createTrackX = () => {
	let segments = new SegmentCreator()
		.lineAt(100, 200, 100, 900, 30) // forward 800
		.lineAt(200, 1000, 400, 1000) // left 200
		.lineAt(500, 900, 500, 800) // down 100
		.lineAt(400, 700, 300, 700) // right 100
		.lineAt(200, 600, 200, 500) // down 100
		.lineAt(300, 400, 400, 400) // left 100
		.lineAt(500, 300, 500, 200) // down 100
		.lineAt(400, 100, 200, 100)  // right 200
		.done();
	return new Track(1100, 300, 1100, segments, new THREE.Vector3(100, 0, 300));
};

let createTrackSquare = () => {
	let segments = new SegmentCreator()
		.lineAt(100, 200, 100, 600, 30)
		.vertLineAt(200, 0, 700, 1200, 50, 700)
		.lineAt(1300, 800, 1300, 1200)
		.lineAt(1200, 1300, 800, 1300)
		.lineAt(700, 1200, 700, 200)
		.lineAt(600, 100, 200, 100)
		.done();
	return new Track(1400, 300, 1400, segments, new THREE.Vector3(100, 0, 300));
};

let createTrackJumps = () => {
	let segments = new SegmentCreator()
		.vertLineAt(200, 0, 200, 200, 0, 300, 60)
		.vertLineAt(200, 0, 400, 200, 50, 500)
		.vertLineAt(200, 50, 600, 200, 0, 700)
		.vertLineAt(300, 0, 800, 400, 0, 800)
		.vertLineAt(500, 0, 700, 500, 0, 600)
		.vertLineAt(500, 0, 500, 500, 50, 400)
		.vertLineAt(500, 50, 300, 500, 0, 200)
		.vertLineAt(400, 0, 100, 300, 0, 100)
		.done();
	return new Track(600, 300, 900, segments, new THREE.Vector3(200, 0, 220));
};

const TRACK_INFOS = [
	new TrackInfo('B', 500, createTrackB()),
	new TrackInfo('X', 1000, createTrackX()),
	new TrackInfo('Square', 3000, createTrackSquare()),
	new TrackInfo('Jump', 0, createTrackJumps()),
];

export default TRACK_INFOS;
