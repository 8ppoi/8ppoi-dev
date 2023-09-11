import { System } from './System.js';
import { TextMap } from './TextMap.js';
import { ImageMap } from './ImageMap.js';
import { Sprite } from './Sprite.js';

export class Graphic {

	static list;
	static imagePalette;
	static objectUrls = {};
	static #graphicMaps = {};
	static cells = {};

	static createTextMap(x, y, text, paletteIndex, parent) {
		return this.#create(new TextMap(x, y, text, paletteIndex, parent));
	}

	static createImageMap(x, y, graphicName, parent) {
		return this.#create(new ImageMap(x, y, graphicName, parent));
	}

	static createSprite(x, y, graphicName, paletteIndex, parent) {
		return this.#create(new Sprite(x, y, graphicName, paletteIndex, parent));
	}

	static #create(graphicMap) {
		this.#graphicMaps[graphicMap.graphicMapId] = graphicMap;
		return graphicMap;
	}

	static destroy(graphicMap) {
		graphicMap.container.remove();
		delete this.#graphicMaps[graphicMap.graphicMapId];
	}

	static destroyAll() {
		for (const graphicMap of Object.values(this.#graphicMaps)) {
			this.destroy(graphicMap);
		}
	}

	static async start() {
		return import(`./cartridges/${System.cartridgeName}/graphic/list.js`)
			.then(listModule => {
				this.list = listModule.default;
				this.imagePalette = Object.keys(this.list);
				return Promise.all(
					Object.keys(this.list).map(graphicName => {
						this.objectUrls[graphicName] = [];
						this.cells[graphicName] = [];
						return import(`./cartridges/${System.cartridgeName}/graphic/${graphicName}.js`)
							.then(graphicModule => {
								this.list[graphicName].width = graphicModule.default[0][0].length;
								this.list[graphicName].height = graphicModule.default[0].length;
								const paletteColorIndexes = [ ...new Set(graphicModule.default.flat().flat()) ].sort();
								this.list[graphicName].paletteColorIndexes = paletteColorIndexes;
								return Promise.all(
									graphicModule.default.map((array, sceneIndex) => {
										this.objectUrls[graphicName][sceneIndex] = [];
										return Promise.all(
											paletteColorIndexes.map(paletteColorIndex => {
												const imageData = new ImageData(array[0].length, array.length);
												let i = 3;
												for (const row of array) {
													for (const value of row) {
														imageData.data[i] = value === paletteColorIndex ? 255 : 0;
														i += 4;
													}
												}
												const canvas = document.createElement('canvas');
												canvas.width = imageData.width;
												canvas.height = imageData.height;
												canvas.getContext('2d').putImageData(imageData, 0, 0);
												return new Promise(resolve => canvas.toBlob(blob => {
													this.objectUrls[graphicName][sceneIndex][paletteColorIndex] = URL.createObjectURL(blob);
													resolve();
												}));
											})
										)
											.then(() => {
												const cell = document.createElement('div');
												cell.style.width = `${this.list[graphicName].width}px`;
												cell.style.height = `${this.list[graphicName].height}px`;
												cell.style.position = 'absolute';
												cell.style.left = 0;
												cell.style.top = 0;
												for (const [ paletteColorIndex, ObjectUrl ] of this.objectUrls[graphicName][sceneIndex].entries()) {
													const maskImage = document.createElement('div');
													maskImage.style['-webkit-mask-image'] = `url(${ObjectUrl})`;
													maskImage.style.backgroundColor = 'hsl(0, 0%, 50%)';
													maskImage.dataset.paletteColorIndex = paletteColorIndex;
													maskImage.style.width = `${this.list[graphicName].width}px`;
													maskImage.style.height = `${this.list[graphicName].height}px`;
													maskImage.style.position = 'absolute';
													maskImage.style.left = '0px';
													maskImage.style.top = '0px';
													cell.append(maskImage);
												}
												this.cells[graphicName][sceneIndex] = cell;
											})
										;
									})
								);
							})
						;
					})
				);
			})
		;
	}

	static revokeObjectUrls() {
		for (const graphicName of Object.keys(this.objectUrls)) {
			for (const sceneIndex of Object.keys(this.objectUrls[graphicName])) {
				while (this.objectUrls[graphicName][sceneIndex].length) {
					const objectUrl = this.objectUrls[graphicName][sceneIndex].shift();
					URL.revokeObjectURL(objectUrl);
				}
				delete this.objectUrls[graphicName][sceneIndex];
			}
			delete this.objectUrls[graphicName];
		}
	}
}
