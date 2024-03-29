/* global agent */
'use strict';

const assert = require('proclaim');

describe('GET /components.json', () => {

	 it('responds with a 200 status', async () => {
		  const request = agent.get('/components.json');
		  return request.expect(200);
	 });

	 it('responds with JSON', async () => {
		  const request = agent.get('/components.json');
		  return request.expect('Content-Type', /application\/json/);
	 });

	 // Assertions here are based on data in `../mock/repo-data-api/data`
	 describe('JSON response', () => {

		  it('contains a list of all components with supported origamiVersion', async () => {
				const request = agent.get('/components.json');
				const json = (await request.then()).body;
				assert.equal(json.length, 8, 'Expected 8 components.');
		  });

		  it('filters by search query parameter', async () => {
				const search = 'n-example-active';
				const request = agent.get(`/components.json?search=${search}`);
				const json = (await request.then()).body;
				assert.equal(json.length, 1, `Expected to find 1 component for a "${search}" search.`);
		  });

		  it('filters by type "module", "service" query parameter', async () => {
				const tests = [
					 {
						  type: 'module',
						  expected: 4
					 },
					 {
						  type: 'service',
						  expected: 1
					 }
				];
				for (const test of tests) {
					 const request = agent.get(`/components.json?type=${test.type}`);
					 const json = (await request.then()).body;
					 assert.equal(json.length, test.expected, `Expected to find ${test.expected} component(s) for a "${test.type}" component type filter.`);
				}
		  });

		  it('filters by status query parameter', async () => {
				const tests = [
					 {
						  status: 'active',
						  expected: 4
					 },
					 {
						  status: 'maintained',
						  expected: 3
					 },
					 {
						  status: 'experimental',
						  expected: 0
					 },
					 {
						  status: 'deprecated',
						  expected: 1
					 },
					 {
						  status: 'dead',
						  expected: 0
					 }
				];
				for (const test of tests) {
					 const request = agent.get(`/components.json?${test.status}=true`);
					 const json = (await request.then()).body;
					 assert.equal(json.length, test.expected, `Expected to find ${test.expected} component(s) for a "${test.status}" component type filter.`);
				}
		  });

		  it('filters with combined search, status, and type query parameters', async () => {
				const request = agent.get('/components.json?search=o-example&maintained=true&type=component');
				const json = (await request.then()).body;
				assert.equal(json.length, 1, 'Expected to find 1 component for a combined filter.');
		  });
	 });
});
