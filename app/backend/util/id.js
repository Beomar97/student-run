class Id {
	constructor() {
		this.sequence = 0;
	}

	next() {
		return ++this.sequence;
	}
}

module.exports = new Id();
