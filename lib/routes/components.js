'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;

module.exports = app => {

	// TODO this is temporary, we'll work out caching properly later
	const neverCache = cacheControl({
		maxAge: 0
	});

	// Component listing page
	app.get('/components', neverCache, (request, response) => {
		response.render('components', {
			title: `Components - ${app.origami.options.name}`
		});
	});

};
