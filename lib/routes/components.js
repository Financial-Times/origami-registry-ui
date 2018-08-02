'use strict';

const cacheControl = require('@financial-times/origami-service').middleware.cacheControl;
const httpError = require('http-errors');
const express = require('express');
const requestUrl = require('request-promise-native');
const repoListing = require('../repo-listing');
const prism = require('prismjs');
const JsDoc = require('../code-docs/jsdoc');
const Sassdoc = require('../code-docs/sassdoc');
const JsDocNav = require('../code-docs/jsdoc/nav');
const SassDocNav = require('../code-docs/sassdoc/nav');
const cheerio = require('cheerio');
const showdown = require('showdown');

const jsDocExampledata = require('../../test/jsdoc.json'); //@todo replace with real data
const sassDocExampleData = require('../../test/sassdoc.json'); //@todo replace with real data

module.exports = app => {

	const cacheForFiveMinutes = cacheControl({
		maxAge: '5 minutes',
		staleWhileRevalidate: '7 days',
		staleIfError: '7 days'
	});

	const findBrand = (request, response, next) => {
		request.brand = (request.query.brand) ? request.query.brand : 'master';
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
				return response.redirect(307, `${request.basePath}components/${component.name}@${component.version}`);
			}

			// Check that we actually have a component
			if (!component) {
				throw httpError(404);
			}

			// Check for component languages
			if (component.languages) {
				component.hasCSS = (component.languages.includes('css') || component.languages.includes('scss') || component.languages.includes('sass'));
				component.hasJS = component.languages.includes('js');
			};

			request.component = component;
			next();
		} catch (error) {
			if (error.status === 404) {
				response.locals.missingComponentName = componentName;
				response.locals.missingComponentVersion = componentVersion || 'latest';
			}
			next(error);
		}

	};

	// Component listing page
	app.get('/components', cacheForFiveMinutes, express.urlencoded({extended: false}), async (request, response, next) => {
		try {
			let repos = await app.repoData.listRepos();
			const requestedBrand = (request.query.brand) ? request.query.brand : 'master';

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
				filter,
				requestedBrand
			});
		} catch (error) {
			next(error);
		}
	});

	// Individual component page demo
	app.get('/components/:componentId', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const requestedBrand = request.brand;

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
				if (component.requestedBrand === 'master') {
					demos = await app.repoData.listDemos(component.repo, component.id);
				} else {
					demos = await app.repoData.listDemos(component.repo, component.id, component.requestedBrand);
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

			// Augment the component object with a major version number, for use in image sets
			component.majorVersion = component.version;

			// Load and filter all repositories for use in the sidebar
			const repos = (await app.repoData.listRepos()).filter(repo => {
				return (
					repo.support.status === 'active' ||
					repo.support.status === 'maintained'
				);
			});

			// Check if component is brand-able so that we can display a message
			//(has css & js or only css, is a module and hasn't been branded)
			if (component.brands && component.brands.length === 0 && component.type === 'module') {
				if (component.hasCSS && component.hasJS || component.hasCSS) {
					component.brandable = true;
				}
			}

			// Render the component page
			response.render('component', {
				title: `${component.name} - ${app.ft.options.name}`,
				categories: repoListing.categorise(repos),
				component,
				demos,
				dependencies,
				images,
				service,
				versions,
				requestedBrand,
				nav: 'demos'
			});

		} catch (error) {
			next(error);
		}
	});

	// Individual component JsDoc page
	app.get('/components/:componentId/jsdoc', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const requestedBrand = request.brand;
		// Object with nodes by type with nested member nodes (e.g. classes with functions and property nodes attached).
		const componentJsDoc = new JsDoc(jsDocExampledata);
		const jsDocByTypeWithMembers = componentJsDoc.getNodesByTypeWithMembers();
		// Member nodes (e.g. property nodes which belong to a function node).
		const memberJsDocs = componentJsDoc.getNodes().filter(doclet => doclet.memberof !== undefined);
		// Generate navigation.
		const navItems = JsDocNav.createNavigation(componentJsDoc);
		try {
			response.render('jsdoc', {
				title: `${component.name} JsDoc - ${app.ft.options.name}`,
				component,
				versions,
				requestedBrand,
				jsDocByTypeWithMembers,
				memberJsDocs,
				navItems,
				nav: 'jsdoc'
			});
		} catch (error) {
			next(error);
		}
	});

	// Individual component SassDoc page
	app.get('/components/:componentId/sassdoc', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const requestedBrand = request.brand;
		const componentSassDoc = new Sassdoc(component.name, requestedBrand, sassDocExampleData);
		const sassDocNodes = componentSassDoc.getNodes();
		const navItems = SassDocNav.createNavigation(componentSassDoc);
		try {
			response.render('sassdoc', {
				title: `${component.name} SassDoc - ${app.ft.options.name}`,
				component,
				versions,
				requestedBrand,
				sassDocNodes,
				navItems,
				nav: 'sassdoc'
			});
		} catch (error) {
			next(error);
		}
	});

	// Individual component readme page
	app.get('/components/:componentId/readme', cacheForFiveMinutes, findComponent, findBrand, async (request, response, next) => {
		const component = request.component;
		const versions = request.versions;
		const requestedBrand = request.brand;
		try {
			const readme = await app.repoData.getMarkdown(component.repo, component.id, 'readme');
			const converter = new showdown.Converter({simplifiedAutoLink: true});
			converter.setFlavor('github');
			const $ = cheerio.load(converter.makeHtml(readme));

			const nav = $('ul').first();
			const listHtml = nav && nav.html()? nav.html().toLowerCase() : '';
			// Assume the list we found is a nav if it contains a link we expect.
			if (listHtml.indexOf('usage') || listHtml.indexOf('javascript') || listHtml.indexOf('sass')) {
				nav.remove();
			}
			// Update code examples for o-syntax-highlight
			$('code').each(function () {
				const language = $(this).attr('class') ? $(this).attr('class').match('language-([a-z]*)')[1] : null;
				if (language) {
					const newLanguage = language === 'sass' ? 'scss' : language;
					$(this).removeClass(`language-${language}`);
					$(this).removeClass(language);
					$(this).addClass(`o-syntax-highlight--${newLanguage}`);
				}
			});

			$('pre').wrap($('<div data-o-component="o-syntax-highlight"></div>'));
			$('table').addClass('o-table o-table--responsive-scroll').wrap($('<div class="o-table-wrapper"></div>'));
			$('a').not((index, element) => $(element).has('img').length > 0).each(function () {
				try {
					const url = new URL($(this).attr('href'));
					$(this).addClass(url.hostname === request.headers.host ? 'link' : 'link-external');
				} catch (error) {
					$(this).addClass('link');
				}
			});


			const readmeNavItem = {
				'title': 'Readme'
			};
			$('h2, h3').each((index, element) => {
				const link = `#${$(element).attr('id')}`;
				const title = $(element).text();
				const isLevelTwo = $(element).is('h2');
				if (isLevelTwo) {
					readmeNavItem.items = readmeNavItem.items || [];
					readmeNavItem.items.push({ title, link });
				} else if (readmeNavItem.items) {
					const lastIndex = readmeNavItem.items.length - 1;
					readmeNavItem.items[lastIndex].items = readmeNavItem.items[lastIndex].items || [];
					readmeNavItem.items[lastIndex].items.push({ title, link });
				}
			});

			response.render('readme', {
				title: `${component.name} README - ${app.ft.options.name}`,
				component,
				versions,
				requestedBrand,
				readme: $.html(),
				navItems: [readmeNavItem],
				nav: 'readme'
			});
		} catch (error) {
			next(error);
		}
	});
};
