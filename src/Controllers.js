export class Controllers {

	static keys = [
		{
			left: 'j',
			right: 'l',
			up: 'i',
			down: 'k',
			meta0: 'h',
			meta1: 'g',
			button0: 'f',
			button1: 'd',
		},
		{
			left: 'ArrowLeft',
			right: 'ArrowRight',
			up: 'ArrowUp',
			down: 'ArrowDown',
			meta0: 's',
			meta1: 'a',
			button0: 'x',
			button1: 'z',
		},
	];
	static 0 = {};
	static 1 = {};

	static async start() {
		for (const [ controllerId, keyMap ] of this.keys.entries()) {
			for (const key of Object.keys(keyMap)) {
				this[controllerId][key] = false;
			}
		}
		window.onkeydown = () => {
			for (const [ controllerId, keyMap ] of this.keys.entries()) {
				for (const [ key, value ] of Object.entries(keyMap)) {
					if (event.key === value) {
						this[controllerId][key] = true;
					}
				}
			}
		};
		window.onkeyup = () => {
			for (const [ controllerId, keyMap ] of this.keys.entries()) {
				for (const [ key, value ] of Object.entries(keyMap)) {
					if (event.key === value) {
						this[controllerId][key] = false;
					}
				}
			}
		};
	}
}
