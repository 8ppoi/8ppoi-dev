import { GraphicMap } from './GraphicMap.js';
import { Graphic } from './Graphic.js';

export class Sprite extends GraphicMap {

	#imagePaletteIndex;
	#sceneIndex;

	constructor(x, y, graphicName, paletteIndex, parent) {
		super(x, y, Graphic.list[graphicName], 1, 1, parent);
		Object.defineProperties(this, {
			sceneIndex: {
				get: () => this.#sceneIndex,
				set: value => this.setSceneIndex(this.#sceneIndex = value),
			},
		});
		this.#imagePaletteIndex = Graphic.imagePalette.indexOf(graphicName);
		this.sceneIndex = 0;
		this.paletteIndex = paletteIndex !== undefined ? paletteIndex : Graphic.list[graphicName].defaultPaletteIndex;
	}

	setSceneIndex(sceneIndex) {
		this.setImage(0, 0, this.#imagePaletteIndex, sceneIndex);
	}
}
