import { HasError } from "./errorCheck.js";
import { PostEgg, PostEntry } from "./client.js";

const institution = localStorage.getItem("institution");
const isAdmin = localStorage.getItem("isAdmin");

$("#institution").html(`Your Current Institution is: ${institution}`);

if (!isAdmin) {
	$("#back_button").prop("action", "./application.html");
} else {
	$("#back_button").prop("action", "./adminApplication.html");
}

function elementLoaded(el, cb) {
	if ($(el).length) {
		// Element is now loaded.
		cb($(el));
	} else {
		// Repeat every 500ms.
		setTimeout(function () {
			elementLoaded(el, cb);
		}, 500);
	}
}

elementLoaded("#form-a", function (el) {
	// Element is ready to use.
	$("#form-a").addClass("active");
});

// File the user uploads
let selectedFile;

// When file is uploaded to the form,
// Set selectedFile to that file
$("#input").on("change", (event) => {
	selectedFile = event.target.files[0];
});

$("#submit").on("click", OnFileSubmitted);

function OnFileSubmitted() {
	if (!selectedFile) {
		console.error(
			"The eggs cannot be submitted because a file is not selected."
		);

		return;
	}

	const institution = localStorage.getItem("institution");

	if (!institution) {
		console.error(
			"The eggs cannot be submitted because the user is not logged in."
		);

		return;
	}

	const fileReader = new FileReader();

	fileReader.readAsBinaryString(selectedFile);

	fileReader.onload = (event) => OnFileProcessed(event.target.result);
}

async function OnFileProcessed(data) {
	const workbook = XLSX.read(data, { type: "binary" });

	const sheetName = workbook.SheetNames[0];

	const spreadsheet = workbook.Sheets[sheetName];

	const eggs = XLSX.utils.sheet_to_row_object_array(spreadsheet);

	// Remove the first row, second, and third row from the array since they contain the column descriptions.
	eggs.shift();
	eggs.shift();

	if (eggs.length === 0) {
		return;
	}

	let error = false;

	for (let i = 0; i < eggs.length; i++) {
		if (HasError(eggs[i], i)) {
			error = true;
		}
	}

	if (error) {
		return;
	}

	const institution = localStorage.getItem("institution");

	const entry = await PostEntry(institution, new Date());

	for (const egg of eggs) {
		PostEgg(entry.entryId, egg);
	}

	selectedFile = undefined;

	$("#input").val("");
}
