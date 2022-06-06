import { FetchEggs } from "./client.js";
import { NARROW } from "./enumerations.js";

window.addEventListener("beforeprint", () => {
	$("#export").prop("hidden", true);
});

window.addEventListener("afterprint", () => {
	$("#export").prop("hidden", false);
});

$("#export").on("click", () => {
	print();
});

PopulateStatistics();

async function PopulateStatistics() {
	const stats = await GenerateStatistics();

	$("#Total_Eggs").html(`Total Eggs: ${stats.totalEggs}`);

	$("#Total_Unyolked_Eggs").html(
		`Unyolked Eggs: ${stats.unyolkedEggsCount} (${Math.round(
			stats.unyolkedEggsPercent * 100
		)}%)`
	);

	$("#Total_yolked_Eggs").html(
		`Yolked Eggs: ${stats.yolkedEggsCount} (${Math.round(
			stats.yolkedEggsPercent * 100
		)}%)`
	);

	$("#Average_Temp_Eggs").html(
		`Average Temperature of Eggs: ${Number.parseFloat(
			stats.averageTankTemperature
		).toFixed(2)}`
	);

	$("#Average_Mass_Eggs").html(
		`Average Mass of Eggs: ${Number.parseFloat(
			stats.averageEggMass
		).toFixed(2)}`
	);

	$("#Average_Yolked_Mass_Eggs").html(
		`Average Mass of Eggs: ${stats.averageYolkedEggMass}`
	);

	$("#Average_Unyolked_Mass_Eggs").html(
		`Average Mass of Eggs: ${stats.averageUnyolkedEggMass}`
	);

	$("#Most_Pop_Institution").html(
		`Most Popular Institution: ${stats.institutionCount.max.institution}`
	);

	$("#Most_Pop_Exhibit").html(
		`Most Popular Exhibit: ${stats.exhibitCount.max.exhibit}`
	);

	$("#Most_Pop_Female").html(
		`Most Popular Female: ${stats.femaleCount.max.female}`
	);

	$("#Most_Pop_Sire").html(`Most Popular Sire: ${stats.sireCount.max.sire}`);

	$("#Most_Recent_Egg_Laid").html(
		`Latest Egg Laid: ${
			stats.newestEgg ? stats.newestEgg.dateLaid : "None"
		}`
	);

	$("#Most_Oldest_Egg_Laid").html(
		`Oldest Egg Laid: ${
			stats.oldestEgg ? stats.oldestEgg.dateLaid : "None"
		}`
	);

	$("#Unique_Entries_Count").html(
		`Unique Entries Count: ${stats.uniqueEntriesCount}`
	);
}

async function GenerateStatistics() {
	let totalEggs = 0;
	let yolkedEggsCount = 0;
	let yolkedEggsPercent = 0;
	let unyolkedEggsCount = 0;
	let unyolkedEggsPercent = 0;

	let averageEggMass = 0;
	let averageYolkedEggMass = 0;
	let yolkedMassCount = 0;
	let unyolkedMassCount = 0;
	let averageUnyolkedEggMass = 0;
	let averageTankTemperature = 0;
	let tankTemperatureCount = 0;

	let newestEgg = undefined;
	let oldestEgg = undefined;

	const uniqueEntries = Set();

	const institutionCount = {
		max: {
			institution: localStorage.getItem(NARROW.INSTITUTION) || "None",
			count: 0,
		},
	};

	const exhibitCount = {
		max: {
			exhibit: "None",
			count: 0,
		},
	};

	const femaleCount = {
		max: {
			female: "None",
			count: 0,
		},
	};

	const sireCount = {
		max: {
			sire: "None",
			count: 0,
		},
	};

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

	for (const egg of eggs) {
		totalEggs++;
		uniqueEntries.add(egg.entryId)
		if (egg.isYolkPresent) {
			yolkedEggsCount++;
			if (egg.eggMass){
				averageYolkedEggMass += Number.parseInt(egg.eggMass);
				yolkedMassCount++;
			}
			
			
		} else {
			unyolkedEggsCount++;
			if (egg.eggMass){
				averageUnyolkedEggMass += Number.parseInt(egg.eggMass);
				unyolkedMassCount++;
			}
			
		}

		if (
			!newestEgg ||
			new Date(egg.dateLaid) > new Date(newestEgg.dateLaid)
		) {
			newestEgg = egg;
		}

		if (
			!oldestEgg ||
			new Date(egg.dateLaid) < new Date(oldestEgg.dateLaid)
		) {
			oldestEgg = egg;
		}

		if (!institutionCount[egg.institution]) {
			institutionCount[egg.institution] = 1;
		} else {
			institutionCount[egg.institution]++;
		}

		if (
			!institutionCount.max ||
			institutionCount[egg.institution] > institutionCount.max.count
		) {
			institutionCount.max = {
				institution: egg.institution,
				count: institutionCount[egg.institution],
			};
		}

		if (!exhibitCount[egg.exhibit]) {
			exhibitCount[egg.exhibit] = 1;
		} else {
			exhibitCount[egg.exhibit]++;
		}

		if (
			!exhibitCount.max ||
			exhibitCount[egg.exhibit] > exhibitCount.max.count
		) {
			exhibitCount.max = {
				exhibit: egg.exhibit,
				count: exhibitCount[egg.exhibit],
			};
		}

		if (!femaleCount[egg.damHouseNameId]) {
			femaleCount[egg.damHouseNameId] = 1;
		} else {
			femaleCount[egg.damHouseNameId]++;
		}

		if (
			!femaleCount.max ||
			femaleCount[egg.damHouseNameId] > femaleCount.max.count
		) {
			femaleCount.max = {
				female: egg.damHouseNameId,
				count: femaleCount[egg.damHouseNameId],
			};
		}

		if (!sireCount[egg.sireHouseNameId]) {
			sireCount[egg.sireHouseNameId] = 1;
		} else {
			sireCount[egg.sireHouseNameId]++;
		}

		if (
			!sireCount.max ||
			sireCount[egg.sireHouseNameId] > sireCount.max.count
		) {
			sireCount.max = {
				sire: egg.sireHouseNameId,
				count: sireCount[egg.sireHouseNameId],
			};
		}
		if(egg.eggMass){
			averageEggMass += Number.parseInt(egg.eggMass);
		}
		if (egg.tankTemperature){
			averageTankTemperature += Number.parseInt(egg.tankTemperature);
			tankTemperatureCount++;
		}
	}

	if (totalEggs > 0) {
		averageEggMass /= totalEggs;
		if (yolkedMassCount>0){
			averageYolkedEggMass /= yolkedMassCount;
		}
		if (unyolkedMassCount>0){
			averageUnyolkedEggMass /= unyolkedMassCount;
		}
		if (tankTemperatureCount>0){
			averageTankTemperature /= tankTemperatureCount;
		}
		unyolkedEggsPercent = unyolkedEggsCount / totalEggs;
		yolkedEggsPercent = yolkedEggsCount / totalEggs;
	}
	const uniqueEntriesCount = uniqueEntries.size;

	const stats = {
		totalEggs,
		yolkedEggsCount,
		yolkedEggsPercent,
		unyolkedEggsCount,
		unyolkedEggsPercent,
		averageEggMass,
		averageYolkedEggMass,
		averageUnyolkedEggMass,
		averageTankTemperature,
		newestEgg,
		oldestEgg,
		institutionCount,
		exhibitCount,
		femaleCount,
		sireCount,
		uniqueEntriesCount,
	};

	for (const key of Object.keys(stats)) {
		console.log(`${key}`);
		console.log(stats[key]);
	}

	return stats;
}


