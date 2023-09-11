export class Queue {

	static #queueIndex = 0;
	static #queues = {};

	static set(tasks, loop = false) {
		const queueId = this.#queueIndex++;
		const queue = {
			tasks,
			loop,
			taskIndex: 0,
			taskCounter: tasks[0][0],
		};
		this.#queues[queueId] = queue;
		this.#executeTasksWhileTastCounterValueIsZero(queueId, queue);
		return queueId;
	}

	static clear(queueId) {
		delete this.#queues[queueId];
	}

	static clearAll() {
		for (const queueId of Object.keys(this.#queues)) {
			this.clear(queueId);
		}
	}

	static onFrame() {
		for (const [ queueId, queue ] of Object.entries(this.#queues)) {
			queue.taskCounter--;
			this.#executeTasksWhileTastCounterValueIsZero(queueId, queue);
		}
	}

	static #executeTasksWhileTastCounterValueIsZero(queueId, queue) {
		while (this.#queues[queueId] && queue.taskCounter === 0) {
			queue.tasks[queue.taskIndex][1]();
			queue.taskIndex++;
			if (queue.taskIndex === queue.tasks.length) {
				if (queue.loop) {
					queue.taskIndex = 0;
					queue.taskCounter = queue.tasks[0][0];
				}
				else {
					this.clear(queueId);
				}
			} else {
				queue.taskCounter = queue.tasks[queue.taskIndex][0];
			}
		}
	}
}
