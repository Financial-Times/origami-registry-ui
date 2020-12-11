'use strict';

const httpError = require('http-errors');
const { list, rule, validate } = require('guestlist');

module.exports = (request, response, next) => {
    // - brand
    //		At the time of writing our brands are all alphanumeric, but there is
    //		no brand name specification, so be open to brands that are lowercase
    //      alphanumeric characters with dashes.
    const brandRule = rule().matches(/^[a-z0-9-]*$/);
    const versionRule = rule().matches(/[a-z,A-Z,0-9@#.\-_]/);

    const safelist = list()
	.add('brand', brandRule)
	.add('switch-brand', brandRule)
	.add('switch-version', versionRule)
	.add('autoload', rule().isAlphanumeric())
	.add('search', rule().escape())
	.add('type', rule().isAlphanumeric())
	.add('active', rule().isBoolean())
	.add('maintained', rule().isBoolean())
	.add('experimental', rule().isBoolean())
	.add('deprecated', rule().isBoolean())
	.add('dead', rule().isBoolean());

    request.validQuery = validate(request, safelist);

    // Throw a 400 if brand query params are invalid.
    const invalidBrand = request.validQuery.brand !== request.query.brand;
    const invalidSwitchBrand = request.validQuery['switch-brand'] !== request.query['switch-brand'];
    if (invalidBrand || invalidSwitchBrand) {
	return next(httpError(400, `The ${request.query.brand ? '"brand"' : '"switch-brand"'} parameter must only contain brands of lowercase alphanumeric characters with dashes.`));
    }

    // Throw a 400 if version query params are invalid.
    const invalidSwitchVersion = request.validQuery['switch-version'] !== request.query['switch-version'];
    if (invalidSwitchVersion) {
	return next(httpError(400, 'The "switch-version" parameter does not appear to be valid.'));
    }

    next();
};
