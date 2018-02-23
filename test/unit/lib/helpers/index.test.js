'use strict';

const assert = require('proclaim');

describe('helpers', () => {
	let helper;

	beforeEach(() => {
		helper = require('../../../../lib/helpers');
	});

	it('capitalises a string', () => {
		const string = 'lowercase';
		assert.strictEqual(helper.capitalise(string), 'Lowercase');
	});
});
