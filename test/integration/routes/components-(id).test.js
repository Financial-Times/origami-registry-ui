/* global agent */
'use strict';

const assert = require('proclaim');
const {JSDOM} = require('jsdom');

describe('GET /components/:componentId', () => {
	let request;

	describe('when a component name and version is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0');
		});

		it('responds with a 200 status', () => {
			return request.expect(200);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

		// Assertions here are based on data in `../mock/repo-data-api/data`
		describe('HTML response', () => {
			let dom;

			beforeEach(async () => {
				dom = new JSDOM((await request.then()).text);
			});

			it('includes a heading with the component name', () => {
				const heading = dom.window.document.querySelector('.o-layout__heading h1');
				assert.isNotNull(heading);
				assert.include(heading.textContent.trim(), 'o-example-active');
			});

			it('includes the requested version number', () => {
				const currentVersion = dom.window.document.querySelector('[data-test=current-version]');
				assert.isNotNull(currentVersion);
				assert.strictEqual(currentVersion.textContent.trim(), '2.0.0');
			});

			it('includes the support status', () => {
				const supportStatus = dom.window.document.querySelector('[data-test=support-status]');
				assert.isNotNull(supportStatus);
				assert.strictEqual(supportStatus.textContent.trim(), 'active');
			});

			it('includes a canonical url for the latest component version', () => {
				const html = dom.window.document.documentElement.outerHTML;
				assert.include(html, '<link rel="canonical" href="/components/o-example-active">');
			});

		});

	});

	describe('when only a component name is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to the latest version page', () => {
			return request.expect('Location', '/components/o-example-active@2.0.0');
		});

	});

	describe('when a component name and a "latest" version identifier is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@latest');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to the latest version page', () => {
			return request.expect('Location', '/components/o-example-active@2.0.0');
		});

	});

	describe('when a switch brand query parameter is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0?switch-brand=internal');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to correct brand', () => {
			return request.expect('Location', '/components/o-example-active@2.0.0?brand=internal');
		});

	});

	describe('when an invalid switch brand query parameter is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0?switch-brand=inte$rnal');
		});

		it('responds with a 400 status', () => {
			return request.expect(400);
		});

	});

	describe('when a switch version query parameter is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0?switch-version=1.1.1');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to correct brand', () => {
			return request.expect('Location', '/components/o-example-active@1.1.1');
		});

	});

	describe('when an invalid switch version query parameter is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0?switch-version=$');
		});

		it('responds with a 400 status', () => {
			return request.expect(400);
		});

	});

	describe('when a switch version and switch brand query parameter is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@2.0.0?switch-brand=internal&switch-version=1.1.1');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to correct brand', () => {
			return request.expect('Location', '/components/o-example-active@1.1.1?brand=internal');
		});

	});

	describe('when a component name and an empty version identifier is provided', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@');
		});

		it('responds with a 307 status', () => {
			return request.expect(307);
		});

		it('responds with a Location header pointing to the latest version page', () => {
			return request.expect('Location', '/components/o-example-active@2.0.0');
		});

	});

	describe('when a component name includes special characters', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-£');
		});

		it('responds with a 400 status', () => {
			return request.expect(400);
		});
	});

	describe('when a component name with no version includes an encoded hash', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active%23demo');
		});

		it('responds with a 404 status', () => {
			return request.expect(404);
		});
	});

	describe('when the named component does not exist', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-not-a-component');
		});

		it('responds with a 404 status', () => {
			return request.expect(404);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

		describe('HTML response', () => {
			let html;

			beforeEach(async () => {
				html = (await request.then()).text;
			});

			it('contains the error details', () => {
				assert.match(html, /not found/i);
			});

		});

	});

	describe('when the named component version does not exist', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-active@123.456.789');
		});

		it('responds with a 404 status', () => {
			return request.expect(404);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

		describe('HTML response', () => {
			let html;

			beforeEach(async () => {
				html = (await request.then()).text;
			});

			it('contains the error details', () => {
				assert.match(html, /not found/i);
			});

		});

	});

	describe('when the named component has no demos for the brand', () => {

		beforeEach(async () => {
			request = agent.get('/components/o-example-demos-except-whitelabel@1.5.0?brand=whitelabel');
		});

		it('responds with a 200 status', () => {
			return request.expect(200);
		});

		it('responds with HTML', () => {
			return request.expect('Content-Type', /text\/html/);
		});

		describe('HTML response', () => {
			let html;

			beforeEach(async () => {
				html = (await request.then()).text;
			});

			it('contains the component status', () => {
				assert.include(html, 'data-test="support-status"');
			});

		});

	});

});
