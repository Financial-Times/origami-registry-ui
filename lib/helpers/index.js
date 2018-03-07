'use strict';

function capitalise(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function ifEquals(a, b, options) {
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
}

function ifBoth(a, b, options) {
	if (a && b) {
		return options.fn(this);
	}
	return options.inverse(this);
}

function unlessEquals(a, b, options) {
	if (a !== b) {
		return options.fn(this);
	}
	return options.inverse(this);
}

function slugify(value) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\-\s]+/g, '')
		.replace(/\s+/g, '-');
}

function json(value) {
	return JSON.stringify(value);
}

module.exports = {
	capitalise,
	ifBoth,
	ifEquals,
	json,
	slugify,
	unlessEquals
};
