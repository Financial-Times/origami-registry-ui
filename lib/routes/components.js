'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');

module.exports = app => {

	// TODO this is temporary, we'll work out caching properly later
	const neverCache = cacheControl({
		maxAge: 0
	});

	const categoriseRepos = async () => {
		const repos = await app.repoData.listRepos();
		const categories = {
			primitives: [],
			components: [],
			layouts: [],
			utilities: [],
			imagesets: [],
			uncategorised: []
		};

		repos.forEach(repo => {
			if (repo.subType === null) {
				if (repo.type === 'imageset') {
					categories['imagesets'].push(repo);
				} else {
					categories['uncategorised'].push(repo);
				}
			} else {
				categories[repo.subType].push(repo);
			}
		});
		return categories;
	};

	// Component listing page
	app.get('/components', neverCache, async (request, response, next) => {
		try {
			response.render('components', {
				title: `Components - ${app.origami.options.name}`,
				categories: await categoriseRepos()
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

			// Load optional resources
			let demos;
			let images;
			let service;

			// If the component is a module and it has demos, load them
			if (component.type === 'module' && component.resources.demos) {
				demos = await app.repoData.listDemos(component.repo, component.id);

			// If the component is an image set and it has images, load them
			} else if (component.type === 'imageset' && component.resources.images) {
				images = await app.repoData.listImages(component.repo, component.id, {
					sourceParam: 'origami-registry'
				});

			// If the component is a service and it has about data, load it
			} else if (component.type === 'service' && component.resources.manifests.about) {
				service = await app.repoData.getManifest(component.repo, component.id, 'about');

			}

			// Augment the component object with a major version number, for use in image sets
			component.majorVersion = component.version;

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.origami.options.name}`,
				component,
				demos,
				images,
				service,
				versions
			});

		} catch (error) {
			next(error);
		}
	});

};
