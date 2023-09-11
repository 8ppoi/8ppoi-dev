import { System } from './System.js';
import { Queue } from './Queue.js';

export class Sound {

	static #soundQueueIndex = 0;
	static #audioContext;
	static #list;
	static #channels;
	static #sounds = {};
	static #soundQueues = {};

	static start() {
		return import(`./cartridges/${System.cartridgeName}/sound/list.js`)
			.then(listModule => {
				this.#list = listModule.default;
				return Promise.all(
					Object.keys(this.#list).map(soundName => {
						return import(`./cartridges/${System.cartridgeName}/sound/${soundName}.js`)
							.then(soundModule => {
								this.#sounds[soundName] = this.#createSound(soundName, soundModule.default);
							})
						;
					})
				);
			})
		;
	}

	static #createChannels() {
		this.#audioContext = new AudioContext();
		this.#channels = [];
		for (let channelId = 0; channelId < 3; channelId++) {
			this.#channels[channelId] = {};
			this.#channels[channelId].gainNode = this.#audioContext.createGain();
			this.#channels[channelId].gainNode.gain.value = 0;
			this.#channels[channelId].gainNode.connect(this.#audioContext.destination);
			this.#channels[channelId].oscillatorNode = this.#audioContext.createOscillator();
			this.#channels[channelId].oscillatorNode.type = 'square';
			this.#channels[channelId].oscillatorNode.connect(this.#channels[channelId].gainNode);
			this.#channels[channelId].oscillatorNode.start();
		}
	}

	static #createSound(soundName, object) {
		const parameters = Object.assign({
			baseNumFrames: 120,
			baseFrequency: 440,
		}, this.#list[soundName]);
		const soundQueue = {};
		for (const [ channelId, array ] of Object.entries(object)) {
			soundQueue[channelId] = [];
			let numFrames = 0;
			for (const row of array) {
				if (!Array.isArray(row)) {
					for (const [ key, value ] of Object.entries(row)) {
						parameters[key] = value;
					}
				}
				else if (row[1] !== undefined) {
					soundQueue[channelId].push([ numFrames, () => this.#noteOn(channelId, parameters.baseFrequency * 2 ** (row[1] / 12)) ]);
					numFrames = parameters.baseNumFrames * row[0];
				}
				else {
					soundQueue[channelId].push([ numFrames, () => this.#noteOff(channelId) ]);
					numFrames = parameters.baseNumFrames * row[0];
				}
			}
			soundQueue[channelId].push([ numFrames, () => this.#noteOff(channelId) ]);
		}
		return soundQueue;
	}

	static play(soundName, loop = false) {
		if (!this.#channels) {
			this.#createChannels();
		}
		const soundQueueId = this.#soundQueueIndex++;
		const soundQueue = {};
		for (const [ channelId, queue ] of Object.entries(this.#sounds[soundName])) {
			const queueId = Queue.set(queue, loop);
			soundQueue[channelId] = queueId;
		}
		this.#soundQueues[soundQueueId] = soundQueue;
		return soundQueueId;
	}

	static stop(soundQueueId) {
		for (const [ channelId, queueId ] of Object.entries(this.#soundQueues[soundQueueId])) {
			Queue.clear(queueId);
			delete this.#soundQueues[soundQueueId];
			this.#noteOff(channelId);
		}
	}

	static stopAll() {
		for (const soundQueueId of Object.keys(this.#soundQueues)) {
			this.stop(soundQueueId);
		}
	}

	static #noteOn(channelId, frequency) {
		this.#channels[channelId].oscillatorNode.frequency.value = frequency;
		this.#channels[channelId].gainNode.gain.value = 1 / 2;
	}

	static #noteOff(channelId) {
		this.#channels[channelId].gainNode.gain.value = 0;
	}

	static noteOffAll() {
		for (const channelId of Object.keys(this.#channels)) {
			this.#noteOff(channelId);
		}
	}
}
