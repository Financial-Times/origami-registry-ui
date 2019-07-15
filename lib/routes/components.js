'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const express = require('express');
const httpError = require('http-errors');
const JsDoc = require('../code-docs/jsdoc');
const JsDocNav = require('../code-docs/jsdoc/nav');
const NavNode = require('../code-docs/nav-node');
const prism = require('prismjs');
const queryToRepoFilter = require('../query-to-repo-filter');
const ReadMe = require('../code-docs/readme');
const requestUrl = require('request-promise-native');
const Sassdoc = require('../code-docs/sassdoc');
const SassDocNav = require('../code-docs/sassdoc/nav');
const {slugify} = require('../helpers');

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
			url = url + (switchBrand && switchBrand !== 'master' ? `?brand=${switchBrand}` : '');
			return response.redirect(307, url);
		}
		next();
	};

	const findBrand = (request, response, next) => {
		const defaultBrand = 'master';
		const component = request.component;
		const supportedBrands = component && component.brands && component.brands.length ? component.brands : [defaultBrand];
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

		try {
			// Get all versions of the component so we already have the listing
			const versions = await app.repoData.listVersions(componentName);
			request.versions = versions;
			let component;
			let mustRedirect = false;

			// Select the requested version of the component
			if (!componentVersion || componentVersion === 'latest') {
				component = versions[0];
				mustRedirect = true;
			} else {
				component = versions.find(version => version.version === componentVersion);
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

			// Check that we actually have a component
			if (!component) {
				throw httpError(404);
			}

			// Check for component languages
			if (component.languages) {
				component.hasCSS = (component.languages.includes('css') || component.languages.includes('scss') || component.languages.includes('sass'));
				component.hasJS = component.languages.includes('js');
				component.showJSDoc = component.hasJS && (component.type === 'module' || component.type === null);
				component.showSassDoc = component.hasCSS && (component.type === 'module' || component.type === null);
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
	app.get('/components', cacheForFiveMinutes, findBrand, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			const currentBrand = request.currentBrand;
			const query = (request.validQuery.search !== undefined ? request.validQuery : {
				module: true,
				imageset: true,
				service: false,
				active: true,
				maintained: true,
				experimental: false
			});
			response.render('overview', {
				title: app.ft.options.name,
				repos: await app.repoData.listRepos(queryToRepoFilter(query)),
				currentBrand,
				filter: query,
				heading: 'Origami Registry'
			});
		} catch (error) {
			next(error);
		}
	});

	// Component JSON search endpoint (an authenticated proxy for repo data search)
	app.get('/components.json', cacheForFiveMinutes, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			let repos = await app.repoData.listRepos(queryToRepoFilter(request.validQuery));
			repos = await Promise.all(repos.map(repo => {
				return new Promise((resolve, reject) => {
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
			let images;
			let service;

			// If the component is a module and it has demos, load them
			if (component.type === 'module' && component.resources.demos) {
				try {
					demos = await app.repoData.listDemos(component.repo, component.id, currentBrand);
				} catch (error) {
					if (error.status !== 404) {
						throw error;
					}
				}

				// fetch the plain HTML and higlight it so we can style it
				try {
					await Promise.all(demos.filter(demo => demo.display.html).map(async demo => {
						demo.display.plainHTML = await requestUrl(demo.supportingUrls.html);
						demo.display.highlightedHTML = prism.highlight(demo.display.plainHTML, prism.languages.html);
					}));
				} catch (error) {}

			// If the component is an image set and it has images, load them
			} else if (component.type === 'imageset' && component.resources.images) {
				images = await app.repoData.listImages(component.repo, component.id, {
					sourceParam: 'origami-registry'
				});

			// If the component is a service and it has about data, load it
			} else if (component.type === 'service' && component.resources.manifests.about) {
				service = await app.repoData.getManifest(component.repo, component.id, 'about');
			}

			// Load repositories for the sidebar
			const repos = await app.repoData.listRepos({
				status: [
					'active',
					'maintained'
				]
			});

			// Check if component is brandable so that we can display a message
			// (has css & js or only css, is a module and hasn't been branded)
			if (component.brands && component.brands.length === 0 && component.type === 'module') {
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
				images,
				repos,
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
			// Load dependencies
			let dependencies;
			if (component.resources.dependencies) {
				const forBower = (dependency) => dependency.source === 'bower' && !dependency.isDev;
				const forNPM = (dependency) => dependency.source === 'npm' && !dependency.isDev;

				const dependencyList = await app.repoData.listDependencies(component.repo, component.id);

				dependencies = {
					bower: dependencyList.filter(forBower),
					npm: dependencyList.filter(forNPM)
				};
			}

			let browserFeatures;
			const origamiManifest = await app.repoData.getManifest(component.repo, component.id, 'origami');
			if (origamiManifest && origamiManifest.browserFeatures) {
				browserFeatures = origamiManifest.browserFeatures;
			}

			// Render the details page
			response.render('details', {
				title: `${component.name} - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				dependencies,
				versions,
				currentBrand,
				browserFeatures,
				nav: 'details',
				heading: 'Details'
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
			next(registryError);
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

	// Individual component readme page
	app.get('/components/:componentId/readme', cacheForFiveMinutes, findComponentId, switchBrandAndVersion, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;
		try {
			const readmeMarkdown = await app.repoData.getMarkdown(component.repo, component.id, 'readme');
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
				heading: 'Readme'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load README for ${request.componentId}.`);
			next(registryError);
		}
	});
};
