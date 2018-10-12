'use strict';

const express = require('express');
const httpError = require('http-errors');
const repos = require('./data/repos');
const versions = require('./data/versions');

// Create a mock repo data API for use in integration tests
module.exports = async function mockRepoDataApi() {

	// Create an Express app powered by local JSON data
	const api = express();

	// Mount some mock routes
	api.get('/v1/repos', (request, response) => {
		response.send(repos);
	});
	api.get('/v1/repos/:name', (request, response, next) => {
		const repo = repos.find(repo => repo.name === request.params.name);
		if (!repo) {
			return next(httpError(404));
		}
		response.send(repo);
	});
	api.get('/v1/repos/:name/versions', (request, response, next) => {
		if (!versions[request.params.name]) {
			return next(httpError(404));
		}
		response.send(versions[request.params.name]);
	});
	api.get('/v1/repos/:name/versions/:versionId/markdown/:markdownType', (request, response, next) => {
		const repo = repos.find(repo => repo.name === request.params.name);
		if (!repo || !repo._versions.includes(request.params.versionId) || !repo.markdown.readme) {
			return next(httpError(404));
		}
		response.send(repo.markdown.readme);
	});
	api.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
		response.status(error.status).send({
			status: error.status,
			message: error.message
		});
	});

	// Start the API and resolve with it
	return new Promise((resolve, reject) => {
		const server = api.listen(error => {
			if (error) {
				return reject(error);
			}
			api.server = server;
			api.address = `http://localhost:${server.address().port}`;
			return resolve(api);
		});
	});

};
