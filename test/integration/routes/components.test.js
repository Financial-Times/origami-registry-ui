/* global agent */
'use strict';

const assert = require('proclaim');
const {JSDOM} = require('jsdom');

describe('GET /components', () => {
	let request;

	beforeEach(async () => {
		request = agent.get('/components');
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
		let table;

		beforeEach(async () => {
			dom = new JSDOM((await request.then()).text);
			table = dom.window.document.querySelector('[data-test=component-table]');
		});

		it('contains a table of all components', () => {
			assert.isNotNull(table);

			const tableRows = table.querySelectorAll('tbody > tr');
			assert.lengthEquals(tableRows, 4);

			let link;

			link = tableRows[0].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-active@2.0.0');
			assert.strictEqual(link.textContent.trim(), 'o-example-active');

			link = tableRows[1].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-maintained@1.5.0');
			assert.strictEqual(link.textContent.trim(), 'o-example-maintained');

			link = tableRows[2].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/o-example-deprecated@1.0.0');
			assert.strictEqual(link.textContent.trim(), 'o-example-deprecated');

			link = tableRows[3].querySelector('[data-test=component-link]');
			assert.strictEqual(link.getAttribute('href'), '/components/n-example-active@1.2.3');
			assert.strictEqual(link.textContent.trim(), 'n-example-active');

		});

	});

});
