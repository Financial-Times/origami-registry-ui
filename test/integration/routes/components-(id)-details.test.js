/* global agent */
'use strict';

const assert = require('proclaim');

describe('GET /components/:componentId/details', () => {
    let request;

    describe('when a component name and version is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@2.0.0/details');
        });

        it('responds with a 410 status', () => {
            return request.expect(410);
        });

        it('responds with HTML', () => {
            return request.expect('Content-Type', /text\/html/);
        });

        // Assertions here are based on data in `../mock/repo-data-api/data`
        describe('HTML response', () => {
            let text;

            beforeEach(async () => {
                text = (await request.then()).text;
            });

            it('directs the reader to the newer polyfills page or Github for a list of dependencies', () => {
                assert.include(text, 'replaced');
                assert.include(text, 'Github');
                assert.include(text, 'polyfills');
            });
        });

    });

    describe('when only a component name is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active/details');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/details');
        });

    });

    describe('when a component name and a "latest" version identifier is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@latest/details');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/details');
        });

    });

    describe('when the named component does not exist', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-not-a-component/details');
        });

        it('responds with a 404 status', () => {
            return request.expect(404);
        });

        it('responds with HTML', () => {
            return request.expect('Content-Type', /text\/html/);
        });

    });

    describe('when the named component version does not exist', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@123.456.789/details');
        });

        it('responds with a 404 status', () => {
            return request.expect(404);
        });

        it('responds with HTML', () => {
            return request.expect('Content-Type', /text\/html/);
        });

    });


	describe('when the named component version exists as an "O3" component, which the registry does not support', () => {

		beforeEach(async () => {
			request = agent.get('/components/o3-example-active@2.0.0/details');
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

});
