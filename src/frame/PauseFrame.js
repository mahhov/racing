import Input from '../Input.js';
import Frame from './Frame.js';

class PauseFrame extends Frame {
	constructor(input) {
		super(input);
	}

	update() {
		if (this.input.getKey('p') === Input.states.PRESSED)
			this.emit('resume');
	}

	paintUi(ctx, width, height) {
		ctx.fillStyle = 'rgba(0,0,0,.5)';
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = '#fff';
		ctx.font = '20px arial';
		ctx.fillText('PAUSED', width / 2, height / 2);
	}
}

export default PauseFrame;
