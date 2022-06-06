import { GRAPH_TYPE, X_AXIS, Y_AXIS } from "./enumerations.js";
import { ClearNarrowOptions, OpenPopup } from "./viewData.js";

const isAdmin = localStorage.getItem("isAdmin");

if (!isAdmin) {
	$("#Institutions_Option").prop("hidden", true);
	$("#Institutions_Radio").prop("hidden", true);

	$("#narrow_institutions").prop("hidden", true);
} else {
	$("#Institutions_Option").prop("hidden", false);
	$("#Institutions_Radio").prop("hidden", false);

	$("#narrow_institutions").prop("hidden", false);
}

$("#graph").on("click", () => OpenPopup("graph.html"));

$("#Time_Graph_Radio").on("click", ChooseTimeGraph);
$("#Bar_Graph_Radio").on("click", ChooseBarGraph);

$("#Institutions_Radio").on("click", ChooseInstitutions);
$("#Entries_Radio").on("click", ChooseEntries);
$("#Exhibits_Radio").on("click", ChooseExhibits);
$("#Females_Radio").on("click", ChooseFemales);

$("#Total_Eggs_Radio").on("click", ChooseTotalEggs);
$("#Total_Yolked_Eggs_Radio").on("click", ChooseTotalYolkedEggs);
$("#Total_Unyolked_Eggs_Radio").on("click", ChooseTotalUnyolkedEggs);
$("#Mass_Radio").on("click", ChooseAverageMass);
$("#Temperature_Radio").on("click", ChooseAverageTemperature);

function ResetAfterGraphChange() {
	$("#Institutions_Radio").prop("checked", false);
	$("#Entries_Radio").prop("checked", false);
	$("#Exhibits_Radio").prop("checked", false);
	$("#Females_Radio").prop("checked", false);

	$("#Total_Eggs_Radio").prop("checked", false);
	$("#Total_Yolked_Eggs_Radio").prop("checked", false);
	$("#Total_Unyolked_Eggs_Radio").prop("checked", false);
	$("#Mass_Radio").prop("checked", false);
	$("#Temperature_Radio").prop("checked", false);

	$("#Choose_Data").prop("hidden", true);
	$("#Choose_Filters").prop("hidden", true);
	$("#Choose_Comparison").prop("hidden", true);
	$("#graph").prop("hidden", true);

	localStorage.removeItem(GRAPH_TYPE.NAME);
	localStorage.removeItem(X_AXIS.NAME);
	localStorage.removeItem(Y_AXIS.NAME);

	ClearNarrowOptions();
}

function ChooseTimeGraph() {
	ResetAfterGraphChange();

	$("#Choose_Filters").prop("hidden", false);
	$("#Choose_Comparison").prop("hidden", false);

	localStorage.setItem(GRAPH_TYPE.NAME, GRAPH_TYPE.TIME_GRAPH);
	localStorage.setItem(X_AXIS.NAME, X_AXIS.TIME);
}

function ChooseBarGraph() {
	ResetAfterGraphChange();

	$("#Choose_Data").prop("hidden", false);

	localStorage.setItem(GRAPH_TYPE.NAME, GRAPH_TYPE.BAR_GRAPH);
	localStorage.removeItem(X_AXIS.NAME);
}

function ChooseInstitutions() {
	$("#narrow_institutions").prop("hidden", true);
	$("#narrow_entries").prop("hidden", false);
	$("#narrow_exhibits").prop("hidden", false);
	$("#narrow_females").prop("hidden", false);

	$("#Choose_Filters").prop("hidden", false);
	$("#Choose_Comparison").prop("hidden", false);

	localStorage.setItem(X_AXIS.NAME, X_AXIS.INSTITUTIONS);

	ClearNarrowOptions();
}

function ChooseEntries() {
	if (isAdmin) {
		$("#narrow_institutions").prop("hidden", false);
	}

	$("#narrow_entries").prop("hidden", true);
	$("#narrow_exhibits").prop("hidden", false);
	$("#narrow_females").prop("hidden", false);

	$("#Choose_Filters").prop("hidden", false);
	$("#Choose_Comparison").prop("hidden", false);

	localStorage.setItem(X_AXIS.NAME, X_AXIS.ENTRIES);

	ClearNarrowOptions();
}

function ChooseExhibits() {
	if (isAdmin) {
		$("#narrow_institutions").prop("hidden", false);
	}

	$("#narrow_entries").prop("hidden", false);
	$("#narrow_exhibits").prop("hidden", true);
	$("#narrow_females").prop("hidden", false);

	$("#Choose_Filters").prop("hidden", false);
	$("#Choose_Comparison").prop("hidden", false);

	localStorage.setItem(X_AXIS.NAME, X_AXIS.EXHIBITS);

	ClearNarrowOptions();
}

function ChooseFemales() {
	if (isAdmin) {
		$("#narrow_institutions").prop("hidden", false);
	}

	$("#narrow_entries").prop("hidden", false);
	$("#narrow_exhibits").prop("hidden", false);
	$("#narrow_females").prop("hidden", true);

	$("#Choose_Filters").prop("hidden", false);
	$("#Choose_Comparison").prop("hidden", false);

	localStorage.setItem(X_AXIS.NAME, X_AXIS.FEMALES);

	ClearNarrowOptions();
}

function ChooseTotalEggs() {
	$("#graph").prop("hidden", false);

	localStorage.setItem(Y_AXIS.NAME, Y_AXIS.TOTAL_EGGS);
}

function ChooseTotalYolkedEggs() {
	$("#graph").prop("hidden", false);

	localStorage.setItem(Y_AXIS.NAME, Y_AXIS.TOTAL_YOLKED_EGGS);
}

function ChooseTotalUnyolkedEggs() {
	$("#graph").prop("hidden", false);

	localStorage.setItem(Y_AXIS.NAME, Y_AXIS.TOTAL_UNYOLKED_EGGS);
}

function ChooseAverageMass() {
	$("#graph").prop("hidden", false);

	localStorage.setItem(Y_AXIS.NAME, Y_AXIS.MASS);
}

function ChooseAverageTemperature() {
	$("#graph").prop("hidden", false);

	localStorage.setItem(Y_AXIS.NAME, Y_AXIS.TEMPERATURE);
}
