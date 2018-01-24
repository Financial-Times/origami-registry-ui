'use strict';

module.exports = app => {

	// Redirect to the components page
	app.get('/', (request, response) => {
		response.redirect(301, `${request.basePath}components`);
	});

};
