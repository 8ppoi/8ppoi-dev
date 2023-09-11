import { GraphicMap } from './GraphicMap.js';
import { Graphic } from './Graphic.js';

export class TextMap extends GraphicMap {

	#imagePaletteIndex;
	#text;

	constructor(x, y, text, paletteIndex, parent) {
		super(x, y, Graphic.list.Font, text.length, 1, parent);
		Object.defineProperties(this, {
			text: {
				get: () => this.#text,
				set: value => this.#setText(this.#text = value),
			},
		});
		this.#imagePaletteIndex = Graphic.imagePalette.indexOf('Font');
		this.text = text;
		this.paletteIndex = paletteIndex !== undefined ? paletteIndex : Graphic.list.Font.defaultPaletteIndex;
	}

	#setText(text) {
		for (let cx = 0; cx < text.length; cx++) {
			this.setImage(cx, 0, this.#imagePaletteIndex, Graphic.list.Font.characters.indexOf(text.charAt(cx)));
		}
	}
}
