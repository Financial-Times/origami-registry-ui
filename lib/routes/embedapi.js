'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;

module.exports = app => {

	const cacheForOneDay = cacheControl({
		maxAge: '1 day',
		staleWhileRevalidate: '7 days',
		staleIfError: '7 days'
	});

	// Embed API JavaScript
	app.get('/embedapi', cacheForOneDay, (request, response) => {
		response.set('Content-Type', 'application/javascript');
		response.render('embedapi-js', {
			layout: null,
			autoload: request.validQuery.autoload
		});
	});

};
