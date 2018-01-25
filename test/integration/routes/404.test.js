/* global agent */
'use strict';

const assert = require('proclaim');

describe('GET /404', () => {
	let request;

	beforeEach(async () => {
		request = agent.get('/404');
	});

	it('responds with a 404 status', () => {
		return request.expect(404);
	});

	it('responds with HTML', () => {
		return request.expect('Content-Type', /text\/html/);
	});

	describe('HTML response', () => {
		let response;

		beforeEach(async () => {
			response = (await request.then()).text;
		});

		it('contains the error details', () => {
			assert.match(response, /Not Found/);
		});

	});

});
