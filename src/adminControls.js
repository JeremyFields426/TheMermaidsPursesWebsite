import { FetchEntries, DeleteEntry } from "./client.js";

let entryId = undefined;

$("#select_entries").on("change", SelectEntry);
$("#delete").on("click", DeleteSelectedEntry);
$("#delete").prop("disabled", true);

UpdateEntries();

async function DeleteSelectedEntry() {
	await DeleteEntry(entryId);

	entryId = undefined;

	await UpdateEntries();
}

async function SelectEntry() {
	entryId = $("#select_entries").val();

	if (!entryId) {
		entryId = undefined;

		$("#delete").prop("disabled", true);
	} else {
		$("#delete").prop("disabled", false);
	}

	console.log(entryId);
}

async function UpdateEntries() {
	entryId = undefined;

	const entries = await FetchEntries(undefined);

	$("#select_entries").find("option").remove().end();

	$("#select_entries").append(
		$("<option></option>").val(undefined).html(`All`)
	);

	for (const entry of entries) {
		const date = new Date(entry.entryDate);

		$("#select_entries").append(
			$("<option></option>")
				.val(entry.entryId)
				.html(
					`${entry.institution}, Entry ${
						entry.entryId
					}, ${date.toLocaleDateString()}`
				)
		);
	}
}
