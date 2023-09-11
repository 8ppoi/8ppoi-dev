import { GraphicMap } from './GraphicMap.js';
import { Graphic } from './Graphic.js';

export class ImageMap extends GraphicMap {

	constructor(x, y, array, parent) {
		super(x, y, Graphic.list[Graphic.imagePalette[0]], array[0].length, array.length, parent);
		for (let cy = 0; cy < array.length; cy++) {
			for (let cx = 0; cx < array[0].length; cx++) {
				this.setImage(cx, cy, array[cy][cx], 0);
			}
		}
	}
}
