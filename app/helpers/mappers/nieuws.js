module.exports = (eventName, event, data) => {
	if (data.fields.medium.app === false) {
		return null;
	}
	
	const title = {};
	let description = {};

	Object.keys(data.fields.url).forEach(language => {
		if (language !== "multiLanguage") {
			title[language] = data.fields.url[language].description;
		}
	});

	Object.keys(data.fields.description).forEach(language => {
		if (language !== "multiLanguage") {
			const fieldContent = data.fields.description[language];
			const cleanFieldContent = fieldContent.replace(/<\/?[^>]+(>|$)/g, "");

			description[language] = cleanFieldContent;
		}
	});

	// 'en' is required:
	if (!description.en) {
		// Indien er geen en is geef de nl content mee
		description.en = data.fields.description.nl.replace(/<\/?[^>]+(>|$)/g, "");
	}
	if (!title.en) {
		// Indien er geen en is geef de nl content mee
		title.en = data.fields.url.nl.description;
	}

	// check if expireDate and sendDate is avaiable
	// Base lifetime = 3 dagen
	let lifetime = 259200;
	let sendDate = new Date(Date.now()).toString();

	if (data.fields.expireDate && data.fields.sendDate) {
		if (new Date(data.fields.expireDate) > new Date(data.fields.sendDate)) {
			lifetime = (new Date(data.fields.expireDate) - new Date(data.fields.sendDate)) / 1000;
		}
	}
	if (data.fields.sendDate) {
		const sendDateContent = new Date(data.fields.sendDate);

		sendDate = sendDateContent.toString();
	}

	let message = {
		"app_id": "a58dfb59-f1c5-4444-858e-565342c05d94",
		"included_segments": ["Active Users"],
		"data": {
			"icon": data.fields.notificatieIcon,
			"url": data.fields.url.nl.url,
		},
		"headings": title,
		"contents": description,
		"send_after": sendDate,
		"ttl": lifetime,
	};
	
	return message;
};
