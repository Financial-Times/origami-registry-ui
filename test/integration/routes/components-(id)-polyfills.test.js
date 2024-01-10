/* global agent */
'use strict';

const assert = require('proclaim');

describe('GET /components/:componentId/polyfills', () => {
    let request;

    describe('when a component name and version is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@2.0.0/polyfills');
        });

        it('responds with a 200 status', () => {
            return request.expect(200);
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

            it('includes the component\'s required browser features', () => {
                assert.include(text, 'DOMTokenList');
            });

            it('includes the component\'s optional browser features', () => {
                assert.include(text, 'IntersectionObserver');
            });
        });

    });

    describe('when only a component name is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active/polyfills');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/polyfills');
        });

    });

    describe('when a component name and a "latest" version identifier is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@latest/polyfills');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/polyfills');
        });

    });

    describe('when the named component does not exist', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-not-a-component/polyfills');
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
            request = agent.get('/components/o-example-active@123.456.789/polyfills');
        });

        it('responds with a 404 status', () => {
            return request.expect(404);
        });

        it('responds with HTML', () => {
            return request.expect('Content-Type', /text\/html/);
        });

    });

});
