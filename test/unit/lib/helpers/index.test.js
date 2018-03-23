'use strict';

const assert = require('proclaim');

describe('helpers', () => {
	let helper;

	beforeEach(() => {
		helper = require('../../../../lib/helpers');
	});

	it('.capitalise', () => {
		const string = 'lowercase';
		assert.strictEqual(helper.capitalise(string), 'Lowercase');
	});

	it('.slugify', () => {
		const string = 'lower case';
		assert.strictEqual(helper.slugify(string), 'lower-case');
	});

	it('.json', () => {
		const string = {string: 'lowercase'};
		assert.strictEqual(helper.json(string), '{"string":"lowercase"}');
	});

	describe('conditional helpers', () => {
		let args = [];
		const opts = {
			fn: () => true,
			inverse: () => false
		};

		describe('.ifEquals', () => {
			it('confirms two arguments are equal (===)', () => {
				args = ['string', 'string'];
				assert.strictEqual(helper.ifEquals(args[0], args[1], opts), true);
			});

			it('confirms two arguments are _not_ equal (!==)', () => {
				args = ['string', ''];
				assert.strictEqual(helper.ifEquals(args[0], args[1], opts), false);
			});
		});

		describe('.ifBoth', () => {
			it('confirms two arguments are both present (&&)', () => {
				args = ['string', 'string'];
				assert.strictEqual(helper.ifBoth(args[0], args[1], opts), true);
			});

			it('confirms two arguments are _not_ both present', () => {
				args = ['string'];
				assert.strictEqual(helper.ifBoth(args[0], args[1], opts), false);
			});
		});

		describe('.ifEither', () => {
			it('confirms one of two arguments is present (||)', () => {
				args = ['string'];
				assert.strictEqual(helper.ifEither(args[0], args[1], opts), true);
			});

			it('confirms neither of two arguments are present', () => {
				args = [];
				assert.strictEqual(helper.ifEither(args[0], args[1], opts), false);
			});
		});

		describe('.unlessEquals', () => {
			it('cconfirms two arguments are _not_ equal (!==)', () => {
				args = ['string', ''];
				assert.strictEqual(helper.unlessEquals(args[0], args[1], opts), true);
			});

			it('confirms two arguments are equal ', () => {
				args = ['string', 'string'];
				assert.strictEqual(helper.unlessEquals(args[0], args[1], opts), false);
			});
		});
	});
});
