import { System } from './System.js';
import { Screen } from './Screen.js';

export class Color {

	static #colors;
	static #colorsStyleSheet;
	static #palettes;
	static #paletteStyleSheets = [];

	static setColor(colorIndex, color) {
		if (this.#colorsStyleSheet.cssRules[colorIndex]) {
			this.#colorsStyleSheet.removeRule(colorIndex);
		}
		this.#colorsStyleSheet.insertRule(`:root { --colors-${colorIndex}: ${color}`, colorIndex);
	}

	static setColorIndex(paletteIndex, paletteColorIndex, colorIndex) {
		if (!this.#paletteStyleSheets[paletteIndex]) {
			this.#paletteStyleSheets[paletteIndex] = new CSSStyleSheet();
			document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, this.#paletteStyleSheets[paletteIndex] ];
		}
		if (this.#paletteStyleSheets[paletteIndex].cssRules[paletteColorIndex]) {
			this.#paletteStyleSheets[paletteIndex].removeRule(paletteColorIndex);
		}
		this.#paletteStyleSheets[paletteIndex].insertRule(`[data-palette-index="${paletteIndex}"] [data-palette-color-index="${paletteColorIndex}"] { background-color: var(--colors-${colorIndex}) !important; }`, paletteColorIndex);
	}

	static async start() {
		this.#colors = (await import(`./cartridges/${System.cartridgeName}/graphic/colors.js`)).default;
		Screen.screen.style.backgroundColor = this.#colors[0];
		this.#colorsStyleSheet = new CSSStyleSheet();
		for (const [ colorIndex, color ] of this.#colors.entries()) {
			this.setColor(colorIndex, color);
		}
		document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, this.#colorsStyleSheet ];
		this.#palettes = (await import(`./cartridges/${System.cartridgeName}/graphic/palettes.js`)).default;
		for (const [ paletteIndex, colorIndexes ] of this.#palettes.entries()) {
			for (const [ paletteColorIndex, colorIndex ] of colorIndexes.entries()) {
				this.setColorIndex(paletteIndex, paletteColorIndex, colorIndex);
			}
		}
	}
}
