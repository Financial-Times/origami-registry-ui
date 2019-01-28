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

	const findBrand = (request, response, next) => {
		// Set the current brand based on the query string,
		// as long as the component is branded
		let currentBrand = 'master';
		const requestedBrand = request.query.brand;
		if (request.component && request.component.brands && request.component.brands.length) {

			// When a brand is set via the querystring
			if (requestedBrand) {
				if (request.component.brands.includes(requestedBrand)) {
					currentBrand = requestedBrand;
				} else {
					throw httpError(404);
				}

				// Default brand
			} else {
				if (request.component.brands.includes('master')) {
					currentBrand = 'master';
				} else {
					// If the component does not support masterbrand,
					// we should default to the first brand it announces
					// support for
					currentBrand = request.component.brands[0];
				}
			}
		}

		request.currentBrand = currentBrand;
		next();
	};

	const findComponent = async (request, response, next) => {
		const [componentName, componentVersion] = request.params.componentId.split('@');

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
					/^(\/components\/([^\/])*)/g,
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
	app.get('/components', cacheForFiveMinutes, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			const query = (request.query.search !== undefined ? request.query : {
				module: true,
				imageset: true,
				service: true,
				active: true,
				maintained: true,
				experimental: true
			});
			response.render('overview', {
				title: `Components - ${app.ft.options.name}`,
				repos: await app.repoData.listRepos(queryToRepoFilter(query)),
				filter: query
			});
		} catch (error) {
			next(error);
		}
	});

	// Component JSON search endpoint (an authenticated proxy for repo data search)
	app.get('/components.json', cacheForFiveMinutes, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			let repos = await app.repoData.listRepos(queryToRepoFilter(request.query));
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
	app.get('/components/:componentId', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
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
			const subnavFilterLabel = `Filter ${demos ? 'Demos &' : ''} Info`;

			// Demo navigation
			if (demos) {
				const demoNavNode = new NavNode('Demos');
				for (const demo of demos) {
					demoNavNode.addItem(new NavNode(demo.title, `#demo-${slugify(demo.title)}`));
				}
				navItems.push(demoNavNode);
			}

			// Info navigation
			const infoNavNode = new NavNode('Info');
			if (dependencies && (dependencies.bower.length || dependencies.npm.length)) {
				infoNavNode.addItem(new NavNode('Dependencies', '#dependencies'));
			}
			infoNavNode.addItem(new NavNode('Support Details', '#support'));
			navItems.push(infoNavNode);

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.ft.options.name}`,
				canonical: component.canonicalUrl,
				component,
				demos,
				dependencies,
				images,
				repos,
				service,
				versions,
				currentBrand,
				nav: 'index',
				subnavFilterLabel,
				navItems
			});

		} catch (error) {
			next(error);
		}
	});

	// Individual component JsDoc page
	app.get('/components/:componentId/jsdoc', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;
		let jsDocData;
		try {
			jsDocData = await requestUrl({
				uri: `${app.ft.options.codedocsEndpoint}/jsdoc/${request.params.componentId}`,
				headers: {
					'x-api-key': app.ft.options.codedocsApiKey
				},
				json: true
			});
		} catch (error) {
			const registryError = new Error(`Unable to load jsdocs for ${request.params.componentId}.`);
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
			const defaultNode = allNodes.find(node =>
				node.name &&
				node.name.toLowerCase() === `${component.name.replace('-', '')}`
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
				subnavFilterLabel: 'Filter JSDoc',
				nav: 'jsdoc'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load JSDoc for ${request.params.componentId}.`);
			next(registryError);
		}
	});

	// Individual component SassDoc page
	app.get('/components/:componentId/sassdoc', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const currentBrand = request.currentBrand;
		let sassDocData;
		try {
			sassDocData = await requestUrl({
				uri: `${app.ft.options.codedocsEndpoint}/sassdoc/${request.params.componentId}`,
				headers: {
					'x-api-key': app.ft.options.codedocsApiKey
				},
				json: true
			});
		} catch (error) {
			const registryError = new Error(`Unable to load sassdoc for ${request.params.componentId}.`);
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
				subnavFilterLabel: 'Filter SassDoc',
				nav: 'sassdoc'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load sassdoc for ${request.params.componentId}.`);
			next(registryError);
		}
	});

	// Individual component readme page
	app.get('/components/:componentId/readme', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
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
				subnavFilterLabel: 'Filter Readme',
				nav: 'readme'
			});
		} catch (error) {
			const registryError = new Error(`Unable to load README for ${request.params.componentId}.`);
			next(registryError);
		}
	});
};
