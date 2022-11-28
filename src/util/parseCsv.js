const parseCsv = (text = '', delimiter = ',') => {
	// this is a very simple csv parser function and not very reliable
	let rows = text.split(/\r\n|\n/);
	let headers = rows[0].split(delimiter);
	let items = [];
	for (let i = 1; i < rows.length; i++) {
		let data = rows[i].split(delimiter);
		if (data.length === headers.length) {
			let item = {};
			for (let j = 0; j < headers.length; j++) {
				item[headers[j]] = data[j];
			}
			items.push(item);
		}
	}
	return items;
};

export default parseCsv;
