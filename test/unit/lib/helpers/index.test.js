'use strict';

const assert = require('proclaim');
// const sinon = require('sinon');

const helper = require('../../../../lib/helpers');

describe('helpers', () => {
	it('capitalises a string', () => {
		const string = 'lowercase';
		assert.strictEqual(helper.capitalise(string), 'Lowercase');
	});
});
