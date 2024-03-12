'use strict';

module.exports = app => {
	app.get('/*', (request, response, _next) => {
		response.render('decomission-notice');
	});
};
