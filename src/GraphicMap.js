import { Graphic } from './Graphic.js';
import { Screen } from './Screen.js';

export class GraphicMap {

	#graphicMapIndex = 0;
	graphicMapId;
	#cellWidth;
	#cellHeight;
	container;
	#cells = [];
	#cellContainers = [];
	maskImages = [];
	#visible;
	#x;
	#y;
	#scaleX = 1;
	#scaleY = 1;

	constructor(x, y, parameters, cellWidth, cellHeight, parent = Screen.screen) {
		this.graphicMapId = this.#graphicMapIndex++;
		this.#cellWidth = cellWidth;
		this.#cellHeight = cellHeight;
		this.#createContainer(parameters, parent);
		this.#createMaskImages(parameters);
		this.#defineProperties();
		this.visible = true;
		this.x = x;
		this.y = y;
		this.scaleX = 1;
		this.scaleY = 1;
	}

	#createContainer(parameters, parent) {
		this.container = document.createElement('div');
		this.container.style.position = 'absolute';
		this.container.style.imageRendering = 'pixelated';
		this.container.style.width = `${parameters.width * this.#cellWidth}px`;
		this.container.style.height = `${parameters.height * this.#cellHeight}px`;
		parent.append(this.container);
	}

	#createMaskImages(parameters) {
		for (let cy = 0; cy < this.#cellHeight; cy++) {
			this.#cells[cy] = [];
			this.maskImages[cy] = [];
			this.#cellContainers[cy] = [];
			for (let cx = 0; cx < this.#cellWidth; cx++) {
				this.#cells[cy][cx] = null;
				this.#cellContainers[cy][cx] = document.createElement('div');
				this.#cellContainers[cy][cx].style.width = `${parameters.width}px`;
				this.#cellContainers[cy][cx].style.height = `${parameters.height}px`;
				this.#cellContainers[cy][cx].style.position = 'absolute';
				this.#cellContainers[cy][cx].style.left = `${parameters.width * cx}px`;
				this.#cellContainers[cy][cx].style.top = `${parameters.height * cy}px`;
				this.container.append(this.#cellContainers[cy][cx]);
			}
		}
	}

	#defineProperties() {
		Object.defineProperties(this, {
			cells: {
				get: () => this.#cells,
			},
			visible: {
				get: () => this.#visible,
				set: value => this.container.style.visibility = this.#visible = value ? 'visible' : 'hidden',
			},
			x: {
				get: () => this.#x,
				set: value => this.container.style.left = `${Math.floor(this.#x = value)}px`,
			},
			y: {
				get: () => this.#y,
				set: value => this.container.style.top = `${Math.floor(this.#y = value)}px`,
			},
			scaleX: {
				get: () => this.#scaleX,
				set: value => this.container.style.scale = `${Math.sign(this.#scaleX = value)} ${Math.floor(this.#scaleY)}`,
			},
			scaleY: {
				get: () => this.#scaleY,
				set: value => this.container.style.scale = `${Math.sign(this.#scaleX)} ${Math.floor(this.#scaleY = value)}`,
			},
			paletteIndex: {
				set: value => {
					for (let cy = 0; cy < this.#cellHeight; cy++) {
						for (let cx = 0; cx < this.#cellWidth; cx++) {
							this.setPaletteIndex(cx, cy, value);
						}
					}
				},
			},
		});
	}

	setImage(cx, cy, imagePaletteIndex, sceneIndex = 0) {
		this.#cells[cy][cx] = imagePaletteIndex;
		this.#cellContainers[cy][cx].innerText = '';
		if (imagePaletteIndex !== undefined) {
			const graphicName = Graphic.imagePalette[imagePaletteIndex];
			this.#cellContainers[cy][cx].append(Graphic.cells[graphicName][sceneIndex].cloneNode(true));
			this.#cellContainers[cy][cx].dataset.paletteIndex = Graphic.list[graphicName].defaultPaletteIndex;
		}
	}

	setPaletteIndex(cx, cy, paletteIndex) {
		this.#cellContainers[cy][cx].dataset.paletteIndex = paletteIndex;
	}
}
