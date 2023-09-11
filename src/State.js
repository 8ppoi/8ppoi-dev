import { System } from './System.js';

export class State {

	static currentState;
	static #stateStack = [];

	static push(stateName) {
		return import(`./cartridges/${System.cartridgeName}/${stateName}.js`)
			.then(module => {
				if (this.currentState) {
					this.#stateStack.push(this.currentState);
				}
				this.currentState = module[stateName];
				return this.currentState.onPush ? this.currentState.onPush() : null;
			})
		;
	}

	static pop() {
		this.currentState = this.#stateStack.pop();
		return this.currentState.onPop ? this.currentState.onPop() : null;
	}
}
