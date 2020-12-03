/* global agent */
'use strict';

const assert = require('proclaim');
const {JSDOM} = require('jsdom');

describe('GET /components', () => {
	let request;

	beforeEach(async () => {
		request = agent.get('/components');
	});

	it('responds with a 200 status', async () => {
		return request.expect(200);
	});

	it('responds with HTML', () => {
		return request.expect('Content-Type', /text\/html/);
	});

	// Assertions here are based on data in `../mock/repo-data-api/data`
	describe('HTML response', () => {
		let dom;
		let list;

		beforeEach(async () => {
			dom = new JSDOM((await request.then()).text);
			list = dom.window.document.querySelector('[data-test=component-list]');
		});

		it('contains a list of all active and maintained components, imagesets, and services by default', () => {
			assert.isNotNull(list);

			const listItems = list.querySelectorAll('[data-test=component-list-item]');
			assert.lengthEquals(listItems, 5);

			const listItemText = Array.from(listItems).map(i => i.textContent).join('');

			assert.include(listItemText, 'o-example-active', 'Did not find a "o-example-active" element in document.');
			assert.include(listItemText, 'o-example-no-readme', 'Did not find a "o-example-no-readme" element in document.');
			assert.include(listItemText, 'o-example-maintained', 'Did not find a "o-example-maintained" element in document.');
			assert.include(listItemText, 'o-example-imageset-maintained', 'Did not find a "o-example-imageset-maintained" element in document.');
			assert.include(listItemText, 'o-example-service-maintained', 'Did not find a "o-example-service-maintained" element in document.');
		});
	});
});
