import { Ui } from './Ui.js';
import { Screen } from './Screen.js';
import { State } from './State.js';
import { Queue } from './Queue.js';
import { Controllers } from './Controllers.js';
import { Graphic } from './Graphic.js';
import { Sound } from './Sound.js';

export class System {

	static isLocal;
	static #busy;
	static fps = parseInt(localStorage.getItem('fps')) || 60;
	static cartridgeName;

	static async start(cartridgeName) {
		if (cartridgeName) cartridgeName = cartridgeName.replace(/#.*/, '');
		this.isLocal = !cartridgeName ? true : false;
		Ui.start(document.getElementById('uiContainer'));
		await this.loadCartridge(cartridgeName || localStorage.getItem('cartridgeName') || 'WelcomeTo8ppoi');
		this.setInterval(this.fps);
	}

	static async #onFrame() {
		if (this.busy) {
			console.info('Frame skipped.');
			return;
		}
		this.#busy = true;
		Queue.onFrame();
		State.currentState.onFrame ? await State.currentState.onFrame() : null;
		this.#busy = false;
	}

	static loadCartridge(cartridgeName) {
		localStorage.setItem('cartridgeName', cartridgeName);
		this.cartridgeName = cartridgeName;
		if (this.isLocal) {
			Ui.cartridgeNameElement.innerText = cartridgeName;
		}
		document.title = `8ppoi - ${cartridgeName}`;
		Graphic.destroyAll();
		Graphic.revokeObjectUrls();
		Sound.stopAll();
		return State.push('Index');
	}

	static setInterval(fps) {
		this.clearInterval();
		this.fps = fps;
		localStorage.setItem('fps', this.fps);
		this.intervalId = setInterval(() => {
			this.#onFrame();
		}, 1000 / this.fps);
	}

	static clearInterval() {
		clearInterval(this.intervalId);
	}

	static step() {
		this.#onFrame();
		Sound.noteOffAll();
	}
}
