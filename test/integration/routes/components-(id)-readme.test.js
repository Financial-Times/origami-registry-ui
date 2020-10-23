/* global agent */
'use strict';

const assert = require('proclaim');
const { JSDOM } = require('jsdom');

describe('GET /components/:componentId/readme', () => {
    let request;

    describe('when a component name and version is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@2.0.0/readme');
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

            it('includes a canonical url for the latest component version', () => {
                const html = dom.window.document.documentElement.outerHTML;
                assert.include(html, '<link rel="canonical" href="/components/o-example-active/readme">');
            });

            it('includes the component\'s readme', () => {
                const readmeContent = dom.window.document.querySelector('#test-readme');
                assert.isNotNull(readmeContent);
                assert.strictEqual(readmeContent.textContent.trim(), 'test-readme');
            });

        });

    });

    describe('when only a component name is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active/readme');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/readme');
        });

    });

    describe('when a component name and a "latest" version identifier is provided', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-active@latest/readme');
        });

        it('responds with a 307 status', () => {
            return request.expect(307);
        });

        it('responds with a Location header pointing to the latest version page', () => {
            return request.expect('Location', '/components/o-example-active@2.0.0/readme');
        });

    });

    describe('when the named component does not exist', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-not-a-component/readme');
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
            request = agent.get('/components/o-example-active@123.456.789/readme');
        });

        it('responds with a 404 status', () => {
            return request.expect(404);
        });

        it('responds with HTML', () => {
            return request.expect('Content-Type', /text\/html/);
        });

    });

    describe('when the named component version does not have a readme', () => {

        beforeEach(async () => {
            request = agent.get('/components/o-example-no-readme@2.0.0/readme');
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

            it('includes a canonical url for the latest component version', () => {
                const html = dom.window.document.documentElement.outerHTML;
                assert.include(html, '<link rel="canonical" href="/components/o-example-no-readme/readme">');
            });

            it('includes a notice that there is no readme for the component version selected', () => {
                const document = dom.window.document.documentElement;
                assert.include(document.textContent.trim(), 'has no README');
            });

        });

    });

});
