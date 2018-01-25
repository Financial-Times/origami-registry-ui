'use strict';

const sinon = require('sinon');

const RepoDataClient = module.exports = sinon.stub();

const mockRepoDataClient = module.exports.mockRepoDataClient = {
	isMockRepoDataClient: true
};

RepoDataClient.returns(mockRepoDataClient);
