import CAR_INFOS from '../car/CarInfo.js';
import GameEntity from '../GameEntity.js';
import Save from '../Save.js';
import TRACK_INFOS from '../track/TrackInfo.js';
import CarFrame from './CarFrame.js';
import EndFrame from './EndFrame.js';
import GameFrame from './GameFrame.js';
import PauseFrame from './PauseFrame.js';
import TrackEditorFrame from './TrackEditorFrame.js';
import TrackFrame from './TrackFrame.js';

class FrameManager extends GameEntity {
	#save = Save.load();
	#activeTrackInfo;
	#activeCarInfo;

	#trackFrame;
	#trackEditorFrame;
	#carFrame;
	#gameFrame;
	#pauseFrame;
	#endFrame;
	#activeFrame;

	constructor(input, scene, camera) {
		super();
		this.#trackFrame = new TrackFrame(input, this.#save);
		this.#trackEditorFrame = new TrackEditorFrame(input);
		this.#carFrame = new CarFrame(input, this.#save);
		this.#gameFrame = new GameFrame(input, scene, camera);
		this.#pauseFrame = new PauseFrame(input, this.#gameFrame);
		this.#endFrame = new EndFrame(input, this.#gameFrame);

		this.#activeFrame = this.#trackFrame;

		this.#trackFrame.carText = CAR_INFOS[0].name;
		this.#trackFrame.addListener('select', trackInfo => {
			this.#activeTrackInfo = trackInfo;
			this.#gameFrame.reset(trackInfo.track, this.#activeCarInfo);
			this.#activeFrame = this.#gameFrame;
		});
		this.#trackFrame.addListener('editor', () => this.#activeFrame = this.#trackEditorFrame);
		this.#trackFrame.addListener('selectCar', () => this.#activeFrame = this.#carFrame);

		this.#trackEditorFrame.addListener('back', () => this.#activeFrame = this.#trackFrame);

		this.#carFrame.addListener('select', carInfo => {
			this.#activeCarInfo = carInfo;
			this.#trackFrame.carText = carInfo.name;
		});
		this.#carFrame.addListener('selectTrack', () => this.#activeFrame = this.#trackFrame);

		this.#gameFrame.addListener('pause', () => this.#activeFrame = this.#pauseFrame);
		this.#gameFrame.addListener('end', win => {
			if (win) {
				this.#save.currency += this.#activeTrackInfo.reward;
				let index = TRACK_INFOS.indexOf(this.#activeTrackInfo);
				this.#save.tracksUnlocked[index + 1] = true;
				this.#save.save();
			}
			this.#endFrame.setEnd(win);
			this.#activeFrame = this.#endFrame;
		});

		this.#pauseFrame.addListener('resume', () => this.#activeFrame = this.#gameFrame);
		this.#pauseFrame.addListener('abandon', () => this.#activeFrame = this.#trackFrame);

		this.#endFrame.addListener('back', () => this.#activeFrame = this.#trackFrame);
	}

	get uiOnly() {
		return ![this.#gameFrame, this.#pauseFrame, this.#endFrame].includes(this.#activeFrame);
	}

	update() {
		this.#activeFrame.update();
	}

	paintUi(uiTexture) {
		this.#activeFrame.paintUi(uiTexture);
	}
}

export default FrameManager;
