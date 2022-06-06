import { FetchEggs } from "./client.js";
import { GRAPH_TYPE, NARROW, X_AXIS, Y_AXIS } from "./enumerations.js";

window.addEventListener("beforeprint", () => {
	$("#export").prop("hidden", true);
});

window.addEventListener("afterprint", () => {
	$("#export").prop("hidden", false);
});

$("#export").on("click", () => {
	print();
});

const BACKGROUND_COLORS = [
	"rgba(255, 99, 132, 0.2)",
	"rgba(54, 162, 235, 0.2)",
	"rgba(255, 206, 86, 0.2)",
	"rgba(75, 192, 192, 0.2)",
	"rgba(153, 102, 255, 0.2)",
	"rgba(255, 159, 64, 0.2)",
];

const BORDER_COLORS = [
	"rgba(255, 99, 132, 1)",
	"rgba(54, 162, 235, 1)",
	"rgba(255, 206, 86, 1)",
	"rgba(75, 192, 192, 1)",
	"rgba(153, 102, 255, 1)",
	"rgba(255, 159, 64, 1)",
];

const yearCountCutoff = 5;
let clusterByYear = false;

Generate();

async function Generate() {
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

	clusterByYear = DetermineClusterByYear(eggs);

	const clusters = await GenerateClusters(eggs);

	const points = GeneratePoints(clusters);

	GenerateChart(points);
}

async function GenerateClusters(eggs) {
	const x_axis_key = GetClusterKey();
	const y_axis_key = localStorage.getItem(Y_AXIS.NAME);

	const clusters = {};

	for (const egg of eggs) {
		AddClusterItem(clusters, egg, x_axis_key, y_axis_key);
	}

	return clusters;
}

function AddClusterItem(clusters, egg, x_axis_key, y_axis_key) {
	let x_axis_value = egg[x_axis_key];

	if (!x_axis_value) {
		return;
	}

	if (y_axis_key === Y_AXIS.TEMPERATURE && !egg["tankTemperature"]) {
		return;
	}

	if (y_axis_key === Y_AXIS.MASS && !egg["eggMass"]) {
		return;
	}

	if (x_axis_key === "dateLaid") {
		x_axis_value = GetTimeCluster(x_axis_value);
	}

	if (!clusters[x_axis_value]) {
		clusters[x_axis_value] = [];
	}

	clusters[x_axis_value] = [...clusters[x_axis_value], egg];
}

function GetClusterKey() {
	const x_axis = localStorage.getItem(X_AXIS.NAME);

	switch (x_axis) {
		case X_AXIS.INSTITUTIONS:
			return "institution";
		case X_AXIS.ENTRIES:
			return "entryId";
		case X_AXIS.EXHIBITS:
			return "exhibit";
		case X_AXIS.FEMALES:
			return "damHouseNameId";
		case X_AXIS.TIME:
			return "dateLaid";
	}
}

function GetTimeCluster(dateLaid) {
	const date = new Date(dateLaid);

	const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
		date
	);

	const year = date.getFullYear();

	if (clusterByYear) {
		return `${year}`;
	}

	return `${month} ${year}`;
}

function DetermineClusterByYear(eggs) {
	const years = new Set();

	for (const egg of eggs) {
		const dateLaid = egg["dateLaid"];

		if (!dateLaid) {
			continue;
		}

		const date = new Date(dateLaid);

		years.add(date.getFullYear());
	}

	return years.size > yearCountCutoff;
}

function GeneratePoints(clusters) {
	const ReducerFn = GetReducer();
	const SortFn = GetSorter();

	let points = [];

	for (const x of Object.keys(clusters)) {
		const y = clusters[x].reduce(ReducerFn, 0);

		points = [...points, { x, y }];
	}

	points = points.sort(SortFn);

	return points;
}

function GetReducer() {
	const y_axis = localStorage.getItem(Y_AXIS.NAME);

	switch (y_axis) {
		case Y_AXIS.TOTAL_EGGS:
			return (total) => total + 1;
		case Y_AXIS.TOTAL_YOLKED_EGGS:
			return (total, egg) => (egg.isYolkPresent ? total + 1 : total);
		case Y_AXIS.TOTAL_UNYOLKED_EGGS:
			return (total, egg) => (egg.isYolkPresent ? total : total + 1);
		case Y_AXIS.MASS:
			return (total, egg, _, arr) =>
				(total * arr.length + Number.parseInt(egg.tankTemperature)) /
				arr.length;
		case Y_AXIS.TEMPERATURE:
			return (total, egg, _, arr) =>
				(total * arr.length + Number.parseInt(egg.eggMass)) /
				arr.length;
	}
}

function GetSorter() {
	const x_axis = localStorage.getItem(X_AXIS.NAME);

	switch (x_axis) {
		case X_AXIS.INSTITUTIONS:
		case X_AXIS.ENTRIES:
		case X_AXIS.EXHIBITS:
		case X_AXIS.FEMALES:
			return undefined;
		case X_AXIS.TIME:
			return GetTimeSorter();
	}
}

function GetTimeSorter() {
	return (a, b) => {
		let ax = "";
		let bx = "";

		if (clusterByYear) {
			ax = `January 1, ${a.x}`;
			bx = `January 1, ${b.x}`;
		} else {
			ax = a.x.replace(" ", " 1, ");
			bx = b.x.replace(" ", " 1, ");
		}

		const date1 = new Date(ax);
		const date2 = new Date(bx);

		if (date1 < date2) {
			return -1;
		}

		if (date1 > date2) {
			return 1;
		}

		return 0;
	};
}

function GenerateChart(points) {
	const graphType = localStorage.getItem(GRAPH_TYPE.NAME);

	const x_axis = localStorage.getItem(X_AXIS.NAME);
	const y_axis = localStorage.getItem(Y_AXIS.NAME);

	const data = {
		labels: points.map((point) => point.x),
		datasets: [
			{
				data: points.map((point) => point.y),
				backgroundColor: points.map(
					(_, index) =>
						BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]
				),
				borderColor: points.map(
					(_, index) => BORDER_COLORS[index % BORDER_COLORS.length]
				),
				borderWidth: 1,
			},
		],
	};

	const config = {
		type: graphType,
		data: data,
		options: {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: `${x_axis} vs. ${y_axis}`,
				},
				legend: {
					display: false,
				},
				scales: {
					y: {
						min: 0,
					},
				},
			},
		},
	};

	return new Chart("myChart", config);
}
