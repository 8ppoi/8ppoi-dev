export default {
	Brick: {
		defaultPaletteIndex:2,
	},
	Poi: {
		defaultPaletteIndex:1,
	},
	Font: {
		defaultPaletteIndex:0, characters:[...Array(95)].map((_, i) => String.fromCharCode(0x20 + i)).join(''),
	},
}
