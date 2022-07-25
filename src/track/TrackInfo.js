import SegmentCreator from './SegmentCreator.js';

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

const TRACK_INFOS = [
	new TrackInfo('B', 500, new SegmentCreator()
		.lineAt(100, 200, 100, 900) // forward 800
		.lineAt(200, 1000, 400, 1000) // left 200
		.lineAt(500, 900, 500, 800) // down 100
		.lineAt(400, 700, 300, 700) // right 100
		.lineAt(200, 600, 200, 500) // down 100
		.lineAt(300, 400, 400, 400) // left 100
		.lineAt(500, 300, 500, 200) // down 100
		.lineAt(400, 100, 200, 100)  // right 200
		.done()),
	new TrackInfo('X', 1000, new SegmentCreator()
		.lineAt(100, 200, 100, 400)
		.vertLineAt(200, 0, 500, 500, 50, 500)
		.lineAt(600, 500, 800, 500)
		.lineAt(900, 600, 900, 800)
		.lineAt(800, 900, 600, 900)
		.lineAt(500, 800, 500, 200)
		.lineAt(400, 100, 200, 100)
		.done()),
	new TrackInfo('Square', 3000, new SegmentCreator()
		.lineAt(100, 200, 100, 500, 30)
		.lineAt(200, 600, 500, 600)
		.lineAt(600, 500, 600, 200)
		.lineAt(500, 100, 200, 100)
		.done()),
	new TrackInfo('Jump', 0, new SegmentCreator()
		.vertLineAt(200, 0, 200, 200, 0, 300, 60)
		.vertLineAt(200, 0, 400, 200, 50, 500)
		.vertLineAt(200, 50, 600, 200, 0, 700)
		.vertLineAt(300, 0, 800, 400, 0, 800)
		.vertLineAt(500, 0, 700, 500, 0, 600)
		.vertLineAt(500, 0, 500, 500, 50, 400)
		.vertLineAt(500, 50, 300, 500, 0, 200)
		.vertLineAt(400, 0, 100, 300, 0, 100)
		.done()),
	new TrackInfo('Test', 0, new SegmentCreator()
		.lineAt(300, 200, 200, 500)
		.lineAt(200, 600, 400, 800)
		.lineAt(500, 700, 700, 600)
		.lineAt(800, 500, 700, 200)
		.lineAt(600, 100, 400, 100)
		.done()),
	new TrackInfo('Test', 0, new SegmentCreator()
		.lineAt(1200, 400, 1100, 1100)
		.lineAt(1000, 1200, 700, 1500)
		.lineAt(600, 1500, 200, 1500)
		.lineAt(100, 1400, 100, 900)
		.lineAt(200, 800, 700, 800)
		.lineAt(800, 700, 900, 600)
		.lineAt(900, 500, 900, 200)
		.lineAt(1000, 100, 1400, 100)
		.lineAt(1500, 200, 1500, 300)
		.lineAt(1400, 400, 1300, 400)
		.done()),
	new TrackInfo('Test', 0, new SegmentCreator()
		.lineAt(1100, 800, 900, 800)
		.lineAt(800, 700, 800, 600)
		.lineAt(900, 500, 1100, 500)
		.lineAt(1200, 400, 1200, 300)
		.lineAt(1100, 200, 900, 200)
		.lineAt(800, 300, 600, 300)
		.lineAt(500, 400, 300, 400)
		.lineAt(200, 500, 200, 700)
		.lineAt(300, 800, 500, 800)
		.lineAt(600, 900, 600, 1100)
		.lineAt(500, 1200, 300, 1200)
		.lineAt(200, 1300, 200, 1400)
		.lineAt(300, 1500, 400, 1500)
		.lineAt(500, 1400, 500, 1300)
		.lineAt(600, 1200, 700, 1200)
		.lineAt(800, 1300, 800, 1400)
		.lineAt(900, 1500, 1100, 1500)
		.lineAt(1200, 1400, 1200, 1300)
		.lineAt(1100, 1200, 1000, 1200)
		.lineAt(900, 1100, 900, 1000)
		.lineAt(1000, 900, 1400, 900)
		.lineAt(1500, 800, 1500, 700)
		.lineAt(1400, 600, 1300, 600)
		.lineAt(1200, 700, 1100, 700)
		.done()),
];

export default TRACK_INFOS;
