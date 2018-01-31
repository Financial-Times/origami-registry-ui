/* global agent */
'use strict';

describe('GET /', () => {
	let request;

	beforeEach(() => {
		request = agent.get('/');
	});

	it('responds with a 301 status', () => {
		return request.expect(301);
	});

	it('responds with a Location header pointing to the components page', () => {
		return request.expect('Location', '/components');
	});

});
