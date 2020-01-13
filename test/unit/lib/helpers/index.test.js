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
		assert.strictEqual(helper.capitalise(null), '', 'Expected `capitalise` to handle `null` values.');
	});

	it('.slugify', () => {
		assert.strictEqual(helper.slugify('lower case'), 'lower-case');
		assert.strictEqual(helper.slugify('Some thing£-wild*'), 'some-thing-wild');
		assert.strictEqual(helper.slugify(undefined), '');
	});

	it('.json', () => {
		const string = {string: 'lowercase'};
		assert.strictEqual(helper.json(string), '{"string":"lowercase"}');
	});

	describe('.markdown', () => {
		it('converts markdown to html', () => {
			const string = 'some copy';
			assert.strictEqual(helper.markdown(string), '<p>some copy</p>');
		});

		it('supports "header level start"', () => {
			const string = '#my-h1\n##my-h2';
			const headerLevelStart = 3;
			assert.strictEqual(helper.markdown(string, headerLevelStart), '<h3 id="myh1">my-h1</h3>\n<h4 id="myh2">my-h2</h4>');
		});

		it('automatically escapes HTML tags so code comments cannot break registry ui"', () => {
			const string = 'Base tables styles - add to <table>';
			assert.strictEqual(helper.markdown(string), '<p>Base tables styles - add to &lt;table&gt;</p>');
		});
	});

	describe('conditional helpers', () => {
		let args = [];
		const opts = {
			fn: () => true,
			inverse: () => false
		};

		describe('.ifAny', () => {
			it('confirms one argument out of many is a match (||)', () => {
				args = ['string', 'string1'];
				assert.strictEqual(helper.ifAny('string', args[0], args[1], opts), true);
			});

			it('confirms no argument out of many is a match', () => {
				args = ['string', 'string1'];
				assert.strictEqual(helper.ifAny('string2', args[0], args[1], opts), false);
			});
		});

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
