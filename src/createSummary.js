import { FetchEggs } from "./client.js";
import { NARROW } from "./enumerations.js";
import { ClearNarrowOptions, OpenPopup } from "./viewData.js";

$("#download").on("click", DownloadEggSpreadsheet);
$("#summary").on("click", () => OpenPopup("summary.html"));

ClearNarrowOptions();

async function DownloadEggSpreadsheet() {
	const institution = localStorage.getItem(NARROW.INSTITUTION);
	const entryId = localStorage.getItem(NARROW.ENTRY);
	const exhibit = localStorage.getItem(NARROW.EXHIBIT);
	const female = localStorage.getItem(NARROW.FEMALE);

	const eggs = await FetchEggs({
		institution,
		entryId,
		exhibit,
		female,
	});

	const spreadsheet = CreateEggSpreadsheet("Zebra Shark Eggs", eggs);

	saveAs(spreadsheet, "Zebra Egg Spreadsheet.xlsx");
}

/**
 *
 * @author Jeremy Fields
 * @param {string} sheetName The name of the sheet in excel.
 * @param {Egg[]} eggs The list of eggs that will make up the rows in the spreadsheet
 * (HINT: Use the Fetch Eggs function to obtain the list of eggs using your own filters).
 * @returns {Blob} A binary large object that can be saved to the machine using the saveAs API.
 */
function CreateEggSpreadsheet(sheetName, eggs) {
	const workbook = XLSX.utils.book_new();
	workbook.SheetNames.push(sheetName);

	const rows = [];

	if (eggs.length > 0) {
		const headers = Object.keys(eggs.at(0));

		FormatColumnHeaders(headers);

		headers.shift();

		rows.push(headers);
	}

	for (const egg of eggs) {
		const row = Object.values(egg);

		row.shift();

		rows.push(row);
	}

	const worksheet = (workbook.Sheets[sheetName] =
		XLSX.utils.aoa_to_sheet(rows));

	if (eggs.length > 0) {
		worksheet["!cols"] = FitToColumn(rows);
	}

	const data = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

	return CreateBinaryLargeObject(data);
}

/**
 *
 * @param {string[]} headers
 */
function FormatColumnHeaders(headers) {
	for (let i = 0; i < headers.length; i++) {
		let header = "";

		const tempHeader = headers.at(i).slice(1);
		for (const c of tempHeader) {
			if (c.toUpperCase() === c) {
				header = header + " " + c;

				continue;
			}

			header = header + c;
		}

		header = headers.at(i).charAt(0).toUpperCase() + header;

		headers[i] = header;
	}
}

function FitToColumn(rows) {
	return rows[0].map((a, i) => ({
		wch: Math.max(
			...rows.map((a2) => (a2[i] ? a2[i].toString().length : 0))
		),
	}));
}

function CreateBinaryLargeObject(data) {
	const buffer = new ArrayBuffer(data.length);

	const viewer = new Uint8Array(buffer);

	for (let i = 0; i < data.length; i++) {
		viewer[i] = data.charCodeAt(i) & 0xff;
	}

	return new Blob([buffer], { type: "application/octet-stream" });
}
