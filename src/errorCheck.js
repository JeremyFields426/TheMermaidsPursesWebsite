const NO_ERROR = "NO Error";
const INCORRECT_FORMAT = "Incorrect Format";
const UNEXPECTED_NULL = "Null";

const isAny = {
	label: "Must include any characters or symbols.",
	regex: new RegExp("^.*$"),
};

const isHashNumeric = {
	label: "Must include numbers with #.",
	regex: new RegExp("^(?:(?:#[0-9]+))$"),
};

const isAlphaOrHashNumeric = {
	label: "Must include letters and spaces or numbers with #.",
	regex: new RegExp("^(?:(?:#[0-9]+)|(?:[A-Za-z ]+))$"),
};

const isHashNumericList = {
	label: "Must include numbers with # and commas/spaces in a comma separated list.",
	regex: new RegExp("^(?:(?:#[0-9]+(?:, |,))*(?:#[0-9]+))$"),
};

const isBoolean = {
	label: "Must include YES/NO, Yes/No, or yes/no.",
	regex: new RegExp("^(?:YES|Yes|yes|NO|No|no)$"),
};

const isFloatingPoint = {
	label: "Must include a decimal number to one decimal point.",
	regex: new RegExp("^(?:[0-9]+(?:.[0-9])?)$"),
};

const isDate = {
	label: "Must be in the format MM/DD/YYYY.",
	regex: new RegExp("^(?:[0-1]?[0-9]/[0-3]?[0-9]/[1-2][0-9][0-9][0-9])$"),
};

export function HasError(egg, index) {
	const matching = {
		Institution: { match: isAny, null: false },
		Exhibit: { match: isAny, null: false },
		"House ID of Yolked Eggs": { match: isHashNumeric, null: false },
		"Dam(s) House Name or ID": { match: isAlphaOrHashNumeric, null: true },
		"Potential Dam(s)": { match: isHashNumericList, null: true },
		"Sire(s) House Name or ID": { match: isAlphaOrHashNumeric, null: true },
		"Potential Sire(s)": { match: isHashNumericList, null: true },
		"Yolk Present": { match: isBoolean, null: false },
		"Mass of Egg": { match: isFloatingPoint, null: true },
		"Temperature of Tank": { match: isFloatingPoint, null: true },
		"Date Laid": { match: isDate, null: true },
		"Date Shipped": { match: isDate, null: true },
		"Date Retrieved": { match: isDate, null: true },
		"Location Shipped": { match: isAny, null: true },
		Notes: { match: isAny, null: true },
	};

	const errors = {
		Institution: NO_ERROR,
		Exhibit: NO_ERROR,
		"Potential Dam(s)": NO_ERROR,
		"Dam(s) House Name or ID": NO_ERROR,
		"Potential Sire(s)": NO_ERROR,
		"Sire(s) House Name or ID": NO_ERROR,
		"House ID of Yolked Eggs": NO_ERROR,
		"Yolk Present": NO_ERROR,
		"Mass of Egg": NO_ERROR,
		"Temperature of Tank": NO_ERROR,
		"Date Laid": NO_ERROR,
		"Date Shipped": NO_ERROR,
		"Date Retrieved": NO_ERROR,
		"Location Shipped": NO_ERROR,
		Notes: NO_ERROR,
	};

	let error = false;

	for (const key of Object.keys(errors)) {
		let value = egg[key];
		let check = matching[key];

		if (check.null && value === undefined) {
			egg[key] = undefined;

			continue;
		}

		if (!check.null && value === undefined) {
			egg[key] = undefined;

			errors[key] = UNEXPECTED_NULL;
			error = true;

			continue;
		}

		if (key.includes("Date")) {
			egg[key] = value = ExcelDateToJSDate(value);
		}

		if (!check.match.regex.test(value)) {
			errors[key] = INCORRECT_FORMAT;
			error = true;

			continue;
		}

		if (check.match === isHashNumericList) {
			egg[key] = value.replace(/\s/g, "").split(new RegExp(","));
		}
	}

	if (!error) {
		return false;
	}

	let message = `Egg #${index + 1}: \n\n`;

	for (const key of Object.keys(errors)) {
		switch (errors[key]) {
			case NO_ERROR:
				continue;
			case INCORRECT_FORMAT:
				message += `The column named '${key}' with value '${egg[key]}' is incorrect. \n`;
				message += `${matching[key].match.label} \n\n`;
				continue;
			case UNEXPECTED_NULL:
				message += `The column named '${key}' should not be empty. \n\n`;
				continue;
		}
	}

	alert(message);

	return true;
}

function ExcelDateToJSDate(serial) {
	if (serial === undefined) {
		return serial;
	}

	var utc_days = Math.floor(serial - 25569);
	var utc_value = utc_days * 86400;
	var date_info = new Date(utc_value * 1000);

	let month = (date_info.getMonth() + 1).toString();
	let day = (date_info.getDate() + 1).toString();
	let year = date_info.getFullYear().toString();

	return month + "/" + day + "/" + year;
}
