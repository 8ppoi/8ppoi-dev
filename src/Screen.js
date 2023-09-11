export class Screen {

	static screenWidth = 180;
	static screenHeight = 120;
	static uiContainer;
	static screenContainer;
	static screen;

	static createScreenContainer(uiContainer) {
		this.uiContainer = uiContainer;
		this.screenContainer = document.createElement('div');
		this.screen = document.createElement('div');
		this.screen.style.width = `${this.screenWidth}px`;
		this.screen.style.height = `${this.screenHeight}px`;
		this.screen.style.backgroundColor = 'rgb(0, 0, 0)';
		this.screen.style.transformOrigin = '0 0';
		this.screen.style.imageRendering = 'pixelated';
		this.screen.style.overflow = 'hidden';
		this.resizeScreen();
		window.onresize = () => this.resizeScreen();
		this.screenContainer.append(this.screen);
		return this.screenContainer;
	}

	static resizeScreen() {
		const scale = Math.floor(Math.min(window.innerWidth / this.screenWidth, window.innerHeight / this.screenHeight));
		this.uiContainer.style.width = `${this.screenWidth * scale}px`;
		this.screenContainer.style.width = `${this.screenWidth * scale}px`;
		this.screenContainer.style.height = `${this.screenHeight * scale}px`;
		this.screen.style.scale = scale;
		this.screenContainer.style.padding = document.fullscreenElement ? `${(window.innerHeight - this.screenHeight * scale) / 2}px ${(window.innerWidth - this.screenWidth * scale) / 2}px` : '0';
	}

	static fullscreen() {
		this.screenContainer.requestFullscreen();
	}
}
