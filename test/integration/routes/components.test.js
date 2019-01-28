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

		it('contains a list of all components', () => {
			assert.isNotNull(list);

			const listItems = list.querySelectorAll('[data-test=component-list-item]');
			assert.lengthEquals(listItems, 5);

			let link;

			link = listItems[0].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-active@2.0.0');
			assert.include(link.textContent.trim(), 'o-example-active');

			link = listItems[1].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-maintained@1.5.0');
			assert.include(link.textContent.trim(), 'o-example-maintained');

			link = listItems[2].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-deprecated@1.0.0');
			assert.include(link.textContent.trim(), 'o-example-deprecated');

			link = listItems[3].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/n-example-active@1.2.3');
			assert.include(link.textContent.trim(), 'n-example-active');
		});
	});
});
