'use strict';

const repos = require('./repos');
const defaults = require('lodash/defaults');

// Mock versions for integration tests
const versions = module.exports = {};

// Automate creation of repo versions based on
// `_versions` property
for (const repo of repos) {
	versions[repo.name] = repo._versions.map(version => {
		return defaults({version}, repo);
	});
}
