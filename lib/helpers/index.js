'use strict';

const capitalise = string => string.charAt(0).toUpperCase() + string.slice(1);

const ifEquals = (a, b, options) => {
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
};

module.exports = { capitalise, ifEquals };
