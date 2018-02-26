'use strict';

const capitalise = string => string.charAt(0).toUpperCase() + string.slice(1);

const ifEquals = (a, b, options) => {
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
};

const replace = (value, string, options) => {
	if (string.includes(value)) {
		return string.replace(value, '');
	} else {
		return options.fn(this);
	}
};

const json = (value) => {
	return JSON.stringify(value);
};

module.exports = { capitalise, ifEquals, json, replace };
