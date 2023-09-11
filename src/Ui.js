import { System } from './System.js';
import { Screen } from './Screen.js';
import { Sound } from './Sound.js';

export class Ui {

	static romNameElement;
	static pauseButton;
	static resumeButton;
	static stepButton;

	static async start(uiContainer) {
		uiContainer.style.margin = 'auto';
		uiContainer.style.backgroundColor = '#ccc';
		const screenContainer = Screen.createScreenContainer(uiContainer);
		uiContainer.append(screenContainer);
		const menu = document.createElement('div');
		menu.style.display = 'flex';
		menu.style.gap = '1rem';
		menu.append(this.createSpace());
		if (System.isLocal) {
			menu.append(this.createWebSiteLink());
		}
		if (System.isLocal) {
			menu.append(this.createCurrentCartridgeUi());
		}
		if (System.isLocal) {
			menu.append(this.createLoadCartridgeUi());
		}
		menu.append(this.createResetButton());
		menu.append(this.createFpsSelect());
		menu.append(this.createDebugUi());
		menu.append(this.createFullscreenButton());
		uiContainer.append(menu);
	}

	static createSpace() {
		const space = document.createElement('div');
		space.style.flexGrow = 1;
		return space;
	}

	static createWebSiteLink() {
		const webSiteLink = document.createElement('a');
		webSiteLink.innerText = 'https://8ppoi.com';
		webSiteLink.href = 'https://8ppoi.com';
		return webSiteLink;
	}

	static createCurrentCartridgeUi() {
		const currentCartridgeUi = document.createElement('div');
		currentCartridgeUi.style.display = 'flex';
		currentCartridgeUi.style.gap = '0.25rem';
		currentCartridgeUi.append('current cartridge:');
		this.cartridgeNameElement = document.createElement('div');
		this.cartridgeNameElement.style.fontWeight = 'bold';
		currentCartridgeUi.append(this.cartridgeNameElement);
		return currentCartridgeUi;
	}

	static createLoadCartridgeUi() {
		const loadCartridgeUi = document.createElement('div');
		const loadCartridgeInput = document.createElement('input');
		loadCartridgeInput.type = 'file';
		loadCartridgeInput.webkitdirectory = true;
		loadCartridgeInput.onchange = () => System.loadCartridge(loadCartridgeInput.files[0].webkitRelativePath.replace(/\/.*/, ''));
		const loadCartridgeButton = document.createElement('button');
		loadCartridgeButton.innerText = 'Load cartridge';
		loadCartridgeButton.onmousedown = () => loadCartridgeInput.click();
		loadCartridgeUi.append(loadCartridgeButton);
		return loadCartridgeUi;
	}

	static createResetButton() {
		const resetButton = document.createElement('button');
		resetButton.innerText = 'Reset';
		resetButton.onmousedown = () => {
			this.pauseButton.disabled = false;
			this.resumeButton.disabled = true;
			this.stepButton.disabled = true;
			System.loadCartridge(System.cartridgeName);
		}
		return resetButton;
	}

	static createFpsSelect() {
		const fpsSelect = document.createElement('select');
		fpsSelect.setAttribute('name', 'fps');
		fpsSelect.onchange = () => System.setInterval(fpsSelect.value);
		for (const fps of [ 60, 32, 16, 8, 4, 2, 1 ]) {
			const option = document.createElement('option');
			option.value = fps;
			option.text = `${fps} fps`;
			if (fps === parseInt(localStorage.getItem('fps'))) {
				option.selected = true;
			}
			fpsSelect.append(option);
		}
		return fpsSelect;
	}

	static createDebugUi() {
		const debugUi = document.createElement('div');
		debugUi.style.display = 'flex';
		debugUi.style.gap = '0.25rem';

		this.pauseButton = document.createElement('button');
		this.resumeButton = document.createElement('button');
		this.resumeButton.disabled = true;
		this.stepButton = document.createElement('button');
		this.stepButton.disabled = true;

		this.pauseButton.innerText = 'Pause';
		this.pauseButton.onmousedown = () => {
			this.pauseButton.disabled = true;
			this.resumeButton.disabled = false;
			this.stepButton.disabled = false;
			Sound.noteOffAll();
			System.clearInterval();
		}
		debugUi.append(this.pauseButton);

		this.resumeButton.innerText = 'Resume';
		this.resumeButton.onmousedown = () => {
			this.pauseButton.disabled = false;
			this.resumeButton.disabled = true;
			this.stepButton.disabled = true;
			System.setInterval(System.fps);
		}
		debugUi.append(this.resumeButton);

		this.stepButton.innerText = 'Step';
		this.stepButton.onmousedown = () => System.step();
		debugUi.append(this.stepButton);

		return debugUi;
	}

	static createFullscreenButton() {
		const fullscreenButton = document.createElement('button');
		fullscreenButton.innerText = 'Fullscreen';
		fullscreenButton.onmousedown = () => Screen.fullscreen();
		return fullscreenButton;
	}
}
