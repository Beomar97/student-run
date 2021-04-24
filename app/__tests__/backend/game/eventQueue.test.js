const EventQueue = require("../../../backend/game/eventQueue");

let events = [() => 0, () => 1, () => 2, () => 3, () => 4, () => 5];

let testee = null;
let maxEntries = 5;

beforeEach(() => {
	testee = new EventQueue(maxEntries);
});

function fillQueue() {
	testee.enqueue(events[4](), events[4]);
	testee.enqueue(events[1](), events[1]);
	testee.enqueue(events[5](), events[5]);
	testee.enqueue(events[0](), events[0]);
	testee.enqueue(events[3](), events[3]);
}

describe("Test the EventQueue class", () => {
	test("if enqueue method queues events ordered.", () => {
		fillQueue();
		expect(testee.eventKeysOrdered.toArray()).toEqual([0, 1, 3, 4, 5]);
		expect(testee.events.size).toEqual(5);
		expect(testee.events.get(1)[0]()).toEqual(1);
		expect(testee.ticOfOldestEvent).toEqual(0);
	});

	test("if enqueue method removes oldest event when full.", () => {
		fillQueue();
		testee.enqueue(events[2](), events[2]);
		expect(testee.eventKeysOrdered.toArray()).toEqual([1, 2, 3, 4, 5]);
		expect(testee.events.get(0)).toBeFalsy();
		expect(testee.events.size).toEqual(5);
	});

	test("if enqueue method does not add event older than rest when full.", () => {
		fillQueue();
		testee.enqueue(events[2](), events[2]); //make zero entry fall out
		testee.enqueue(events[0](), events[0]);
		expect(testee.eventKeysOrdered.toArray()).toEqual([1, 2, 3, 4, 5]);
		expect(testee.events.size).toEqual(5);
		expect(testee.events.get(0)).toBeFalsy();
	});

	test("if enqueue method enques events with same tic.", () => {
		fillQueue();
		testee.enqueue(0, () => 42);
		expect(testee.eventKeysOrdered.toArray()).toEqual([0, 1, 3, 4, 5]);
		expect(testee.events.size).toEqual(5);
		expect(testee.events.get(0).length).toEqual(2);
		expect(testee.events.get(0)[0]()).toEqual(0);
		expect(testee.events.get(0)[1]()).toEqual(42);
	});

	test("if dispatch method enques events with same tic.", () => {
		let f0 = jest.fn(() => {});
		let f1 = jest.fn(() => {});
		testee.enqueue(0, f0);
		testee.enqueue(0, f0);
		testee.enqueue(1, f1);
		testee.dispatch(0);
		expect(f0).toHaveBeenCalledTimes(2);
		expect(f1).toHaveBeenCalledTimes(0);
	});

	test("if resetTicOfOldestEvent method resets.", () => {
		testee.enqueue(events[4](), events[4]);
		expect(testee.ticOfOldestEvent).toEqual(4);
		testee.enqueue(events[1](), events[1]);
		expect(testee.ticOfOldestEvent).toEqual(1);
		testee.enqueue(events[2](), events[2]);
		expect(testee.ticOfOldestEvent).toEqual(1);
		testee.resetTicOfOldestEvent();
		expect(testee.ticOfOldestEvent).toBeFalsy();
	});
});
