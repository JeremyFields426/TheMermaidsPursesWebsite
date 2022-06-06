import {
	FetchInstitutions,
	FetchEntries,
	FetchFemales,
	FetchExhibits,
} from "./client.js";
import { NARROW } from "./enumerations.js";
import { GetInstitution } from "./login.js";

const isAdmin = localStorage.getItem("isAdmin");

let institution = undefined;
let entryId = undefined;
let exhibit = undefined;
let female = undefined;

if (!isAdmin) {
	institution = GetInstitution();

	$("#institution").prop("hidden", false);
	$("#institution").html(`Your Current Institution is: ${institution}`);

	$("#narrow_institutions").prop("hidden", true);

	$("#back_button").prop("action", "./application.html");
} else {
	$("#institution").prop("hidden", true);

	$("#narrow_institutions").prop("hidden", false);

	$("#back_button").prop("action", "./adminApplication.html");
}

$("#select_institutions").on("change", SelectInstitution);
$("#select_entries").on("change", SelectEntry);
$("#select_exhibits").on("change", SelectExhibit);
$("#select_females").on("change", SelectFemale);

export function ClearNarrowOptions() {
	localStorage.removeItem(NARROW.INSTITUTION);
	localStorage.removeItem(NARROW.ENTRY);
	localStorage.removeItem(NARROW.EXHIBIT);
	localStorage.removeItem(NARROW.FEMALE);

	if (!isAdmin) {
		localStorage.setItem(NARROW.INSTITUTION, GetInstitution());
	}

	UpdateInstitutions();
}

export async function SelectInstitution() {
	institution = $("#select_institutions").val();

	if (!institution) {
		institution = undefined;
		localStorage.removeItem(NARROW.INSTITUTION);
	} else {
		localStorage.setItem(NARROW.INSTITUTION, institution);
	}

	console.log(institution);

	await UpdateEntries();
}

async function UpdateInstitutions() {
	institution = !isAdmin ? GetInstitution() : undefined;

	if (institution) {
		localStorage.setItem(NARROW.INSTITUTION, institution);
	} else {
		localStorage.removeItem(NARROW.INSTITUTION);
	}

	const institutions = await FetchInstitutions();

	$("#select_institutions").find("option").remove().end();

	$("#select_institutions").append(
		$("<option></option>").val(undefined).html(`All`)
	);

	for (const institution of institutions) {
		$("#select_institutions").append(
			$("<option></option>").val(institution).html(institution)
		);
	}

	await UpdateEntries();
}

async function SelectEntry() {
	entryId = $("#select_entries").val();

	if (!entryId) {
		entryId = undefined;
		localStorage.removeItem(NARROW.ENTRY);
	} else {
		localStorage.setItem(NARROW.ENTRY, entryId);
	}

	console.log(entryId);

	await UpdateExhibits();
}

async function UpdateEntries() {
	entryId = undefined;

	const entries = await FetchEntries(institution);

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

	await UpdateExhibits();
}

async function SelectExhibit() {
	exhibit = $("#select_exhibits").val();

	if (!exhibit) {
		exhibit = undefined;
		localStorage.removeItem(NARROW.EXHIBIT);
	} else {
		localStorage.setItem(NARROW.EXHIBIT, exhibit);
	}

	console.log(exhibit);

	await UpdateFemales();
}

async function UpdateExhibits() {
	exhibit = undefined;

	const exhibits = await FetchExhibits({
		institution,
		entryId,
	});

	$("#select_exhibits").find("option").remove().end();

	$("#select_exhibits").append(
		$("<option></option>").val(undefined).html(`All`)
	);

	for (const exhibit of exhibits) {
		$("#select_exhibits").append(
			$("<option></option>").val(exhibit).html(exhibit)
		);
	}

	await UpdateFemales();
}

async function SelectFemale() {
	female = $("#select_females").val();

	if (!female) {
		female = undefined;
		localStorage.removeItem(NARROW.FEMALE);
	} else {
		localStorage.setItem(NARROW.FEMALE, female);
	}

	console.log(female);
}

async function UpdateFemales() {
	female = undefined;

	const females = await FetchFemales({
		institution,
		entryId,
		exhibit,
	});

	$("#select_females").find("option").remove().end();

	$("#select_females").append(
		$("<option></option>").val(undefined).html(`All`)
	);

	for (const female of females) {
		$("#select_females").append(
			$("<option></option>").val(female).html(female)
		);
	}
}

export function OpenPopup(html, width = 900, height = 750) {
	window.open(html, "popUpWindow", `width = ${width}, height = ${height}`);
}
