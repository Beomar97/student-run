class TableGenerator {
	generate(labels, objects, container) {
		container.innerHTML = "";

		let table = document.createElement("table");
		let thead = document.createElement("thead");
		let tbody = document.createElement("tbody");

		const theadTr = document.createElement("tr");
		for (const item of labels) {
			let theadTh = document.createElement("th");
			theadTh.innerHTML = item;
			theadTr.appendChild(theadTh);
		}
		thead.appendChild(theadTr);
		table.appendChild(thead);

		for (const object of objects) {
			let tbodyTr = document.createElement("tr");
			for (const label of labels) {
				let tbodyTd = document.createElement("td");
				tbodyTd.innerHTML = object[label];
				tbodyTr.appendChild(tbodyTd);
			}
			tbody.appendChild(tbodyTr);
		}
		table.appendChild(tbody);
		table.classList.add("table", "is-fullwidth");

		container.appendChild(table);
	}
}

module.exports = TableGenerator;
