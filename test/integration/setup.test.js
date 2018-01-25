'use strict';

const service = require('../..');
const supertest = require('supertest');

const noop = () => {};
const mockLog = {
	info: noop,
	error: noop,
	warn: noop
};

before(async () => {
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
		global.app.origami.server.close();
		global.app.health.stop();
	}
});
