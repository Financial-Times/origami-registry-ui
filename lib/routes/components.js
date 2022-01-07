'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const express = require('express');
const httpError = require('http-errors');
const JsDoc = require('../code-docs/jsdoc');
const JsDocNav = require('../code-docs/jsdoc/nav');
const NavNode = require('../code-docs/nav-node');
const queryToRepoFilter = require('../query-to-repo-filter');
const ReadMe = require('../code-docs/readme');
const requestUrl = require('request-promise-native');
const Sassdoc = require('../code-docs/sassdoc');
const SassDocNav = require('../code-docs/sassdoc/nav');
const { slugify } = require('../helpers');
const semver = require('semver');

module.exports = app => {

	const cacheForFiveMinutes = cacheControl({
		maxAge: '5 minutes',
		staleWhileRevalidate: '7 days',
		staleIfError: '7 days'
	});

	const findComponentId = (request, response, next) => {
		const componentId = request.params.componentId;
		if (typeof componentId !== 'string' || componentId.match(/[^a-z,A-Z,0-9@#.\-_]/)) {
			return next(httpError(400, 'The component and version provided does not appear to be valid.'));
		}

		request.componentId = componentId;
		next();
	};

	const switchBrandAndVersion = (request, response, next) => {
		const [componentName, componentVersion] = request.componentId.split('@');
		if (request.validQuery['switch-version'] || request.validQuery['switch-brand']) {
			const switchBrand = request.validQuery['switch-brand'];
			const switchVersion = request.validQuery['switch-version'] || componentVersion;
			// Replace version.
			let url = request.url.replace(
				/^(\/components\/([^\/])*)/g,
				`/components/${componentName}@${switchVersion}`
			);
			// Remove query params.
			url = url.replace(/(\?.*)/g, '');
			// Add brand query param.
			url = url + (switchBrand && switchBrand !== 'core' ? `?brand=${switchBrand}` : '');
			return response.redirect(307, url);
		}
		next();
	};

	const findBrand = (request, response, next) => {
		const defaultBrand = 'core';
		const component = request.component;
		const supportedBrands = component && component.brands && component.brands.length ? component.brands : [defaultBrand];
		// The master brand has been renamed the core brand.
		const deprecatedMasterBrandIndex = supportedBrands.indexOf('master');
		if(deprecatedMasterBrandIndex !== -1) {
			supportedBrands.splice(deprecatedMasterBrandIndex, 1, 'core');
		}
		const currentBrand = request.validQuery.brand || defaultBrand;

		// If the current brand is not supported by the component.
		const supportsBrand = supportedBrands.length && supportedBrands.includes(currentBrand);
		const hasStyles = component && component.languages && component.languages.find((language) => ['css', 'scss', 'sass'].includes(language));
		if (component && hasStyles && !supportsBrand) {
			return response.render('brand-unsupported', {
				title: `${component.name} - ${app.ft.options.name}`,
				component: component,
				supportedBrand: supportedBrands.length ? supportedBrands[0] : defaultBrand,
				currentBrand
			});
		}

		request.currentBrand = currentBrand;
		next();
	};

	const findComponent = async (request, response, next) => {

		const [componentName, componentVersion] = request.componentId.split('@');
		switch (componentName) {
			case 'fticons':
			case 'logo-images':
			case 'origami-brand-images':
			case 'origami-flag-images':
			case 'origami-specialist-title-logos':
			case 'podcast-logos':
			case 'social-images':
			  return response.redirect('https://www.ft.com/__origami/service/image/v2/docs/image-sets', 308);
		  }

		try {
			// Get all versions of the component so we already have the listing
			const versions = await app.repoData.listVersions(componentName);
			request.versions = versions;
			let component;
			let mustRedirect = false;

			// If no versions are found for the component name 404 immediately
			if (!Array.isArray(versions)) {
				throw httpError(404);
			}

			// Select the requested version of the component
			if (!componentVersion || componentVersion === 'latest') {
				const sortedVersions = versions
					.sort((a, b) => {
						return semver.rcompare(a.version, b.version);
					});
				const latestStableVersion = sortedVersions.find(repoDataVersion =>
					semver.prerelease(repoDataVersion.version) === null
				);
				component = latestStableVersion || sortedVersions[0];
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
				// Replace component id with version to redirect to:
				// components/[componentId]/rest/of/path
				return response.redirect(307, request.url.replace(
					/^(\/components\/([^\/?])*)/g,
					`/components/${component.name}@${component.version}`
				));
			}

			/// component.isComponent is confusing, "component" could be any Origami project type, for example a library "lib"
			component.isComponent = component.type === 'component' || component.type === 'module';
			component.showRequiredPolyfills = component.isComponent;

			// Check for component languages
			if (component.languages) {
				component.hasCSS = (component.languages.includes('css') || component.languages.includes('scss') || component.languages.includes('sass'));
				component.hasJS = component.languages.includes('js');
				component.showJSDoc = component.hasJS && (component.type === 'component' || component.type === 'module' || component.type === null);
				component.showSassDoc = component.hasCSS && (component.type === 'component' || component.type === 'module' || component.type === null);
			};

			// Add canonical URl for the component (i.e. url for the latest version).
			component.canonicalUrl = request.url
				.replace(`/components/${component.name}@${component.version}`, `/components/${component.name}`)
				.replace(/\/$/g, ''); // remove trailing slash

			request.component = component;

			next();
		} catch (error) {
			if (error.status === 404) {
				response.locals.requestedBrand = request.brand;
				response.locals.missingComponentName = componentName;
				response.locals.missingComponentVersion = componentVersion || 'latest';
			}
			next(error);
		}

	};

	// Component listing page
	app.get('/components', cacheForFiveMinutes, findBrand, express.urlencoded({ extended: false }), async (request, response, next) => {
		try {
			const currentBrand = request.currentBrand;

			const query = (Object.keys(request.validQuery).length ? request.validQuery : {
				type: null,
				active: true,
				maintained: true,
				experimental: false
			});

			const repos = await app.repoData.listRepos(queryToRepoFilter(query));
			for (const repo of repos) {
				// The master brand has been renamed the core brand.
				if(Array.isArray(repo.brands)) {
					const deprecatedMasterBrandIndex = repo.brands.indexOf('master');
					if(deprecatedMasterBrandIndex !== -1) {
						repo.brands.splice(deprecatedMasterBrandIndex, 1, 'core');
					}
				}
			}

			response.render('overview', {
				title: app.ft.options.name,
				repos,
				currentBrand,
				filter: query,
				heading: 'Origami Registry'
			});
		} catch (error) {
			next(error);
		}
	});

	// Component JSON search endpoint (an authenticated proxy for repo data search)
	app.get('/components.json', cacheForFiveMinutes, express.urlencoded({ extended: false }), async (request, response, next) => {
		try {
			let repos = await app.repoData.listRepos(queryToRepoFilter(request.validQuery));
			repos = await Promise.all(repos.map(repo => {
				return new Promise((resolve, reject) => {
					if(Array.isArray(repo.brands)) {
						const deprecatedMasterBrandIndex = repo.brands.indexOf('master');
						if(deprecatedMasterBrandIndex !== -1) {
							repo.brands.splice(deprecatedMasterBrandIndex, 1, 'core');
						}
					}
					const renderContext = Object.assign({
						layout: null
					}, repo);
					app.render('partials/overview/component-list-item', renderContext, (error, html) => {
						if (error) {
							return reject(error);
						}
						repo.listItemHtml = html;
						resolve(repo);
					});
				});
			}));
			response.json(repos);
		} catch (error) {
			next(error);
		}
	});

	// Individual component page demo
	app.get('/components/:componentId', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;

		try {
			// Load optional resources
			let demos;
			let service;

			// If the component is a module and it has demos, load them
			if (component.isComponent && component.resources.demos) {
				try {
					demos = await app.repoData.listDemos(component.repo, component.id, currentBrand);
				} catch (error) {
					if (error.status !== 404) {
						throw error;
					}
				}

				// If the component is a service and it has about data, load it
			} else if (component.type === 'service' && component.resources.manifests.about) {
				service = await app.repoData.getManifest(component.repo, component.id, 'about');
			}

			// Check if component is brandable so that we can display a message
			// (has css & js or only css, is a module and hasn't been branded)
			if (component.brands && component.brands.length === 0 && component.isComponent) {
				if (component.hasCSS && component.hasJS || component.hasCSS) {
					component.brandable = true;
				}
			}

			// Build the navigation
			const navItems = [];

			// Demo navigation
			if (demos) {
				for (const demo of demos) {
					navItems.push(new NavNode(demo.title, `#demo-${slugify(demo.title)}`));
				}
			}

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				demos,
				service,
				versions,
				currentBrand,
				nav: 'index',
				heading: 'Demos',
				navItems
			});

		} catch (error) {
			next(error);
		}
	});

	// Individual component details and dependency page
	app.get('/components/:componentId/details', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;

		try {
			// Render the details page
			response.status(410);
			response.render('details', {
				title: `${component.name} - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				versions,
				currentBrand,
				nav: 'details',
				heading: 'Details'
			});

		} catch (error) {
			next(error);
		}
	});

	// Individual component polyfill page
	app.get('/components/:componentId/polyfills', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;

		if(!component.showRequiredPolyfills) {
			return next(httpError(404));
		}

		try {
			let browserFeatures;
			const origamiManifest = await app.repoData.getManifest(component.repo, component.id, 'origami');
			if (origamiManifest && origamiManifest.browserFeatures) {
				browserFeatures = origamiManifest.browserFeatures;
			}

			// Render the details page
			response.render('polyfills', {
				title: `${component.name} - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				versions,
				currentBrand,
				browserFeatures,
				nav: 'polyfills',
				heading: 'Polyfills'
			});

		} catch (error) {
			next(error);
		}
	});

	// Individual component JsDoc page
	app.get('/components/:componentId/jsdoc', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;
		let jsDocData;
		try {
			jsDocData = await requestUrl({
				uri: `${app.ft.options.codedocsEndpoint}/jsdoc/${request.componentId}`,
				headers: {
					'x-api-key': app.ft.options.codedocsApiKey
				},
				json: true
			});
		} catch (error) {
			const registryError = new Error(`Unable to load jsdocs for ${request.componentId}.`);
			registryError.statusCode = error.statusCode === 404 ? 404 : 503;
			registryError.message = error.statusCode === undefined ? registryError.message : `${registryError.message} Recieved a ${error.statusCode} response when requesting codedocs.`;
			return next(registryError);
		}
		try {
			// Object with nodes by type with nested member nodes (e.g. classes with functions and property nodes attached).
			const componentJsDoc = new JsDoc(jsDocData);
			const jsDocByTypeWithMembers = componentJsDoc.getNodesByTypeWithMembers();
			// Member nodes (e.g. property nodes which belong to a function node).
			const allNodes = componentJsDoc.getNodes();
			const memberJsDocs = allNodes.filter(doclet => doclet.memberof !== undefined);
			// Generate navigation.
			const navItems = JsDocNav.createNavigation(componentJsDoc);
			// Find a default node which will be rendered before a selection is made.
			// i.e. a class or constructor function named after the component
			// `oExampleComponent` or `ExampleComponent`.
			const defaultNode = allNodes.find(node =>
				node.name &&
				(node.name.toLowerCase() === `${component.name.replace('-', '')}` ||
					node.name.toLowerCase() === `${component.name.replace('o-', '')}`)
			);

			response.render('jsdoc', {
				title: `${component.name} JSDoc - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				versions,
				currentBrand,
				jsDocByTypeWithMembers,
				memberJsDocs,
				defaultNode,
				navItems,
				nav: 'jsdoc',
				heading: 'JSDoc'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load JSDoc for ${request.componentId}.`);
			next(registryError);
		}
	});

	// Individual component SassDoc page
	app.get('/components/:componentId/sassdoc', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;
		let sassDocData;
		try {
			sassDocData = await requestUrl({
				uri: `${app.ft.options.codedocsEndpoint}/sassdoc/${request.componentId}`,
				headers: {
					'x-api-key': app.ft.options.codedocsApiKey
				},
				json: true
			});
		} catch (error) {
			const registryError = new Error(`Unable to load sassdoc for ${request.componentId}.`);
			registryError.statusCode = error.statusCode === 404 ? 404 : 503;
			registryError.message = error.statusCode === undefined ? registryError.message : `${registryError.message} Recieved a ${error.statusCode} response when requesting codedocs.`;
			next(registryError);
		}
		try {
			const componentSassDoc = new Sassdoc(component.name, currentBrand, sassDocData);
			const sassDocNodes = componentSassDoc.getNodes();
			const navItems = SassDocNav.createNavigation(componentSassDoc);
			// Find a default node which will be rendered before a selection is made.
			const defaultNode = sassDocNodes.find(node =>
				node.name &&
				node.name.toLowerCase() === `${component.name.replace('-', '')}` ||
				node.name.toLowerCase() === `${component.name.replace('-', '')}all`
			);
			response.render('sassdoc', {
				title: `${component.name} SassDoc - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				versions,
				currentBrand,
				sassDocNodes,
				defaultNode,
				navItems,
				nav: 'sassdoc',
				heading: 'SassDoc'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load sassdoc for ${request.componentId}.`);
			next(registryError);
		}
	});

	/**
	 * A message object.
	 *
	 * @typedef {Object} Message
	 * @property {String} type - An o-message type.
	 * @property {String} state - An o-message state.
	 * @property {String} content - Main message content.
	 * @property {String} [detail] - Additional message content.
	 */

	/**
	 * Get the readme for a component.
	 *
	 * @param {Object} component - The component included in the request.
	 * @param {String} component.repo
	 * @param {String} component.id
	 * @param {String} component.name
	 * @param {String} component.version
	 *
	 * @return {String|Message}
	 */
	async function getReadme(component) {
		try {
			return await app.repoData.getMarkdown(component.repo, component.id, 'readme');
		} catch (error) {
			if (error.status !== 404) {
				return {
					type: 'alert',
					state: 'error',
					content: `Could not load README for ${component.name} at ${component.version}. ` +
						`Error: ${error.status}. Please contact the team for support.`
				};
			}

			return {
				type: 'notice',
				state: 'inform',
				content: `${component.name} at ${component.version} has no README. ` +
					'Please contact the team for support.'
			};
		}

	}

	// Individual component readme page
	app.get('/components/:componentId/readme', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;

		const readmeResult = await getReadme(component);
		const readmeMarkdown = typeof readmeResult === 'string' ? readmeResult : '';
		const readmeMessage = typeof readmeResult === 'object' ? readmeResult : undefined;

		try {
			const readme = new ReadMe(readmeMarkdown, component.versionTag, component.url, request.headers.host);
			const navItems = readme.createNavigation();

			response.render('readme', {
				title: `${component.name} README - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				versions,
				currentBrand,
				readme,
				navItems,
				nav: 'readme',
				heading: 'Readme',
				message: readmeMessage
			});
		} catch (error) {
			const registryError = new Error(`Unable to load README for ${request.componentId}.`);
			next(registryError);
		}
	});
};
