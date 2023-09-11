import { Controllers } from '../../Controllers.js';
import { Color } from '../../Color.js';
import { Graphic } from '../../Graphic.js';
import { Sound } from '../../Sound.js';

export class Index {

	static characters = [];

	static async onPush() {
		await Promise.all([
			Controllers.start(),
			Color.start(),
			Graphic.start(),
			Sound.start(),
		]);
		Graphic.createTextMap(4 * 28 / 2, 6 * 2, 'Welcome to 8ppoi!'.toUpperCase());
		Graphic.createTextMap(4 *  6 / 2, 6 * 4, 'Create and publish your own cartridges.'.toUpperCase());
		Graphic.createTextMap(4 * 10 / 2, 6 * 8, 'Poi: J,L,F,D'.toUpperCase());
		Graphic.createTextMap(4 * 49 / 2, 6 * 8, 'Pui: LEFT,RIGHT,X,Z'.toUpperCase());
		Graphic.createImageMap(-2, 112, [ [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, ] ]);
		for (const playerId of [ 0, 1 ]) {
			this.characters[playerId] = Graphic.createSprite(4 * [ 10,33 ][playerId], 104, 'Poi', [ 1, 3, ][playerId]);
			this.characters[playerId].scaleX = [ 1, -1 ][playerId];
			this.characters[playerId].vx = 0;
			this.characters[playerId].vy = 0;
		}
	}

	static async onFrame() {
		for (const playerId of [ 0, 1 ]) {
			if (Controllers[playerId].button0 && this.characters[playerId].y === 104) {
				this.characters[playerId].vy += -16;
				Sound.play('Jump');
			}
			else if (Controllers[playerId].button1 && this.characters[playerId].y === 104 && this.characters[playerId].vx) {
				this.characters[playerId].vx += -Math.sign(this.characters[playerId].vx);
				Sound.play('Break');
			}
			else if (Controllers[playerId].right || Controllers[playerId].left) {
				this.characters[playerId].vx += (Controllers[playerId].right - Controllers[playerId].left) * (this.characters[playerId].vx ? 2 : 2);
				if (Controllers[playerId].right - Controllers[playerId].left) {
					this.characters[playerId].scaleX = Controllers[playerId].right - Controllers[playerId].left;
				}
			}
			this.characters[playerId].x += this.characters[playerId].vx / 4;
			this.characters[playerId].vx += -Math.sign(this.characters[playerId].vx) * (this.characters[playerId].y === 104);
			this.characters[playerId].y += this.characters[playerId].vy / 4;
			this.characters[playerId].vy += 1;
			if (this.characters[playerId].y >= 104) {
				this.characters[playerId].y = 104;
				this.characters[playerId].vy = 0;
			}
		}
	}
}
