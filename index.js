'use strict';

const dotenv = require('dotenv');
const service = require('./lib/service');
const throng = require('throng');

dotenv.load();

const options = {
	log: console,
	name: 'Origami Registry',
	repoDataApiKey: process.env.REPO_DATA_API_KEY,
	repoDataApiSecret: process.env.REPO_DATA_API_SECRET,
	workers: process.env.WEB_CONCURRENCY || 1
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
