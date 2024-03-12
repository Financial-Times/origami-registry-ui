'use strict';

const dotenv = require('dotenv');
const service = require('./lib/service');
const throng = require('throng');

dotenv.config();

const options = {
	log: console,
	name: 'Origami Registry',
	origamiSite: 'https://origami.ft.com/',
	repoDataApiUrl: process.env.REPO_DATA_API_URL || 'https://origami-repo-data.ft.com',
	repoDataApiKey: process.env.REPO_DATA_API_KEY,
	codedocsApiKey: process.env.CODEDOCS_API_KEY,
	codedocsEndpoint: process.env.CODEDOCS_ENDPOINT,
	repoDataApiSecret: process.env.REPO_DATA_API_SECRET,
	workers: process.env.WEB_CONCURRENCY || 1,
	sentryConfig: {
		captureUnhandledRejections: true
	}
};

throng({
	workers: options.workers,
	start: startWorker
});

function startWorker(id) {
	console.log(`Started worker ${id}`);
	service(options).listen().catch(() => {
		process.exit(1);
	});
}
