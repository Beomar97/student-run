const $ = require("jquery");

class TableGenerator {
	constructor() {}

	static generate(labels, objects, container) {
		$("#players").html("");

		let table = document.createElement("table");
		let thead = document.createElement("thead");
		let tbody = document.createElement("tbody");

		const theadTr = document.createElement("tr");
		for (let i = 0; i < labels.length; i++) {
			let theadTh = document.createElement("th");
			theadTh.innerHTML = labels[i];
			theadTr.appendChild(theadTh);
		}
		thead.appendChild(theadTr);
		table.appendChild(thead);

		for (let j = 0; j < objects.length; j++) {
			let tbodyTr = document.createElement("tr");
			for (let k = 0; k < labels.length; k++) {
				let tbodyTd = document.createElement("td");
				tbodyTd.innerHTML = objects[j][labels[k].toLowerCase()];
				tbodyTr.appendChild(tbodyTd);
			}
			tbody.appendChild(tbodyTr);
		}
		table.appendChild(tbody);

		container.appendChild(table);
	}
}

module.exports = TableGenerator;
