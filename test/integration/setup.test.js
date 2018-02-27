'use strict';

const mockRepoDataApi = require('./mock/repo-data-api/mock-service');
const service = require('../..');
const supertest = require('supertest');

const noop = () => {};
const mockLog = {
	info: noop,
	error: noop,
	warn: noop
};

before(async () => {
	const repoDataApi = global.repoDataApi = await mockRepoDataApi();
	process.env.REPO_DATA_API_URL = repoDataApi.address;
	const app = global.app = service({
		environment: 'test',
		log: mockLog,
		port: process.env.TEST_PORT || 0,
		requestLogFormat: null
	});
	await app.listen();
	global.agent = supertest.agent(app);
});

after(() => {
	if (global.app) {
		global.app.ft.server.close();
		global.app.health.stop();
	}
	if (global.repoDataApi) {
		global.repoDataApi.server.close();
	}
});
