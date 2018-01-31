'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');

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
			const [componentName, componentVersion] = request.params.componentId.split('@');

			// Get all versions of the component so we already have the listing
			const versions = await app.repoData.listVersions(componentName);
			let component;
			let mustRedirect = false;

			// Select the requested version of the component
			if (!componentVersion || componentVersion === 'latest') {
				component = versions[0];
				mustRedirect = true;
			} else {
				component = versions.find(version => version.version === componentVersion);
			}

			// Check that we actually have a component
			if (!component) {
				throw httpError(404);
			}

			// Redirect if we don't have a component version
			if (mustRedirect) {
				return response.redirect(307, `${request.basePath}components/${component.name}@${component.version}`);
			}

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.origami.options.name}`,
				component,
				versions
			});

		} catch (error) {
			next(error);
		}
	});

};
