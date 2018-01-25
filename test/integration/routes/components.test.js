/* global agent */
'use strict';

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

});
