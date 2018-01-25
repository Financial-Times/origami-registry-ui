'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;

module.exports = app => {

	// TODO this is temporary, we'll work out caching properly later
	const neverCache = cacheControl({
		maxAge: 0
	});

	// Component listing page
	app.get('/components', neverCache, async (request, response, next) => {
		try {
			response.render('components', {
				title: `Components - ${app.origami.options.name}`,
				components: await app.repoData.listRepos()
			});
		} catch (error) {
			next(error);
		}
	});

	// Individual component page
	app.get('/components/:componentId', neverCache, async (request, response, next) => {
		try {
			const [name, version] = request.params.componentId.split('@');

			let component;
			if (version) {
				component = await app.repoData.getVersion(name, version);
			} else {
				component = await app.repoData.getRepo(name);
			}
			response.render('component', {
				title: `Components - ${app.origami.options.name}`,
				component
			});
		} catch (error) {
			next(error);
		}
	});

};
