const serverURL = "http://142.93.115.7:5000";

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await in the function call.
 *
 * @author Jeremy Fields
 * @param {string} institution
 * @param {string} password
 * @returns {Promise<boolean>} Whether the authorization was successful created (i.e. the institution is not already in use).
 */
export async function PostAuthorization(institution, password, isAdmin) {
	const { data } = await axios.post(`${serverURL}/auth`, {
		institution,
		password,
		isAdmin,
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {string} institution
 * @param {Date} entryDate
 * @returns {Promise<{ entryId: string, entryDate: Date, institution: string }>} The entry that was created, which has the indicated interface.
 * The entry is provided by the post because the database creates the entry's id which is need for each egg in the entry.
 */
export async function PostEntry(institution, entryDate) {
	const { data } = await axios.post(`${serverURL}/entry`, {
		institution,
		entryDate,
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {string} entryId
 * @param {{ [key: string]: any }} eggJSON
 * @returns {Promise<void>}
 */
export async function PostEgg(entryId, eggJSON) {
	await axios.post(`${serverURL}/egg`, {
		entryId,
		eggJSON,
	});
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {string} entryId
 * @returns {Promise<void>}
 */
export async function DeleteEntry(entryId) {
	await axios.delete(`${serverURL}/entry`, {
		params: { entryId },
	});
}

/* _______________________________________________________________________________________ */

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {string} institution
 * @param {string} password
 * @returns {Promise<{ institution: string, password: string, isAdmin: boolean } | undefined>} Whether the authorization with the provided institution and password exists.
 */
export async function FetchAuthorization(institution, password) {
	const { data } = await axios.get(`${serverURL}/auth`, {
		params: { institution, password },
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @returns {Promise<string[]>} A list of the names of each institution (does not include repeats).
 */
export async function FetchInstitutions() {
	const { data } = await axios.get(`${serverURL}/institution`);

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {string | undefined} institution Narrows down which entries are provided by the fetch. Only entries that are submitted by
 * the given institution will be provided (the filter is not required, it can be included or not).
 * @returns {Promise<{ entryId: string, entryDate: Date, institution: string }[]>} A list of each entry, which has the indicated interface.
 */
export async function FetchEntries(institution) {
	const { data } = await axios.get(`${serverURL}/entry`, {
		params: { institution },
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {{ institution: string | undefined, entryId: string | undefined } | undefined} filters Narrows down which
 * exhibits are provided by the fetch. Only exhibits that appear in the given institution and in the given
 * entry will be provided (the filters are not required, you can include both, either, or neither).
 * @returns {Promise<string[]>} A list of the names of each exhibit based on the filters (does not include repeats).
 */
export async function FetchExhibits(filters) {
	const { data } = await axios.get(`${serverURL}/exhibit`, {
		params: filters,
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {{ institution: string | undefined, entryId: string | undefined, exhibit: string | undefined } | undefined} filters
 * Narrows down which females are provided by the fetch. Only females that appear in the given institution, the given
 * entry, and the given exhibit will be provided (the filters are not required, you can include all, some, or none).
 * @returns {Promise<string[]>} A list of the names of each female based on the filters (does not include repeats).
 */
export async function FetchFemales(filters) {
	const { data } = await axios.get(`${serverURL}/female`, {
		params: filters,
	});

	return data;
}

/**
 * NOTE: This function is asynchronous and returns a promise so you should use await before the function call.
 *
 * @author Jeremy Fields
 * @param {{ institution: string | undefined, entryId: string | undefined, exhibit: string | undefined, female: string | undefined } | undefined} filters
 * Narrows down which eggs are provided by the fetch. Only eggs that appear in the given institution, the given
 * entry, the given exhibit, and the given female will be provided (the filters are not required, you can include all, some, or none).
 * @returns {Promise<{
 * 	entryDate: Date,
 * 	institution: string,
 * 	exhibit: string,
 * 	damHouseNameID: string,
 * 	potentialDams: number,
 * 	sireHouseNameID: string,
 * 	potentialSires: number,
 * 	yolkedEggsHouseID: string,
 * 	IsYolkPresent: boolean,
 * 	eggMass: number,
 * 	tankTemperature: number,
 * 	dateLaid: Date,
 * 	dateShipped: Date,
 * 	dateRetrieved: Date,
 * 	locationShipped: string,
 * 	notes: string,
 * 	}>} A list of each egg, which has the indicated interface.
 */
export async function FetchEggs(filters) {
	const { data } = await axios.get(`${serverURL}/egg`, {
		params: filters,
	});

	ConvertDates(data);

	return data;
}

function ConvertDates(eggs) {
	for (const egg of eggs) {
		for (const key of Object.keys(egg)) {
			if (!key.includes("date")) {
				continue;
			}

			const date = new Date(egg[key]);

			egg[key] = date.toLocaleDateString();
		}
	}
}
