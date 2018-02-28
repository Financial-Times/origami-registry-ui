'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');
const express = require('express');
const request = require('request-promise-native');
const repoListing = require('../repo-listing');

module.exports = app => {

	const fetchHTML = async demo => {
		if (demo.display.html) {
			demo.display.plainHTML = await request(demo.supportingUrls.html);
		}
	};

	const cacheForFiveMinutes = cacheControl({
		maxAge: '5 minutes',
		staleWhileRevalidate: '7 days',
		staleIfError: '7 days'
	});
	// Component listing page
	app.get('/components', cacheForFiveMinutes, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			let repos = await app.repoData.listRepos();

			// Default the filter
			const filterIsPresent = (request.query.search !== undefined);
			const filter = (filterIsPresent ? request.query : repoListing.defaultFilter);

			// Update the repos based on whether they match filters
			repos = repoListing.markVisibilityBySearchTerm(repos, filter.search);
			repos = repoListing.markVisibilityByType(repos, {
				imageset: filter.imageset,
				module: filter.module,
				service: filter.service
			});
			repos = repoListing.markVisibilityByStatus(repos, {
				active: filter.active,
				dead: filter.dead,
				deprecated: filter.deprecated,
				experimental: filter.experimental,
				maintained: filter.maintained
			});

			// Render the view
			response.render('overview', {
				title: `Components - ${app.ft.options.name}`,
				categories: repoListing.categorise(repos),
				filter
			});
		} catch (error) {
			next(error);
		}
	});

	// Individual component page
	app.get('/components/:componentId', cacheForFiveMinutes, async (request, response, next) => {
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

				//If demos have html, fetch plain text
				Promise.all(demos.map(fetchHTML))
				.catch(error => app.ft.log.warn(error.name, error.message));

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

			// Load and filter all repositories for use in the sidebar
			const repos = (await app.repoData.listRepos()).filter(repo => {
				return (
					repo.support.status === 'active' ||
					repo.support.status === 'maintained'
				);
			});

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.ft.options.name}`,
				categories: repoListing.categorise(repos),
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
