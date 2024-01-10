'use strict';

const healthChecks = require('./health-checks');
const origamiService = require('@financial-times/origami-service');
const RepoDataClient = require('@financial-times/origami-repo-data-client');
const requireAll = require('require-all');
const validateQueryParams = require('./middleware/validate-query-params');

module.exports = service;

function service(options) {

	const health = healthChecks(options);
	options.healthCheck = health.checks();
	options.goodToGoTest = health.gtg();
	options.about = require('../about.json');
	options.defaultLayout = 'main';
	options.handlebarsHelpers = require('./helpers');

	const app = origamiService(options);

	app.use(origamiService.middleware.getBasePath());
	app.use((request, response, next) => {
		response.locals.requestUrl = request.url;
		next();
	});
	app.use(validateQueryParams);
	mountRoutes(app);
	app.use(origamiService.middleware.notFound());
	app.use(origamiService.middleware.errorHandler());

	app.health = health;

	app.repoData = new RepoDataClient({
		apiUrl: options.repoDataApiUrl,
		apiKey: options.repoDataApiKey,
		apiSecret: options.repoDataApiSecret
	});

	return app;
}

function mountRoutes(app) {
	requireAll({
		dirname: `${__dirname}/routes`,
		resolve: initRoute => initRoute(app)
	});
}
