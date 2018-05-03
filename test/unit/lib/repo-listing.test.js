'use strict';

const assert = require('proclaim');
const sinon = require('sinon');

describe('lib/repo-listing', () => {
	let repoListing;

	beforeEach(() => {
		repoListing = require('../../../lib/repo-listing');
	});

	it('exports an object', () => {
		assert.isObject(repoListing);
	});

	describe('repoListing.buildCategoryMap(categories)', () => {
		let returnValue;

		beforeEach(() => {
			returnValue = repoListing.buildCategoryMap([
				'category',
				'example',
				'mock'
			]);
		});

		it('returns the expected category map', () => {
			assert.deepEqual(returnValue, {
				category: {
					id: 'category',
					name: 'Category',
					visible: true,
					repos: []
				},
				example: {
					id: 'example',
					name: 'Example',
					visible: true,
					repos: []
				},
				mock: {
					id: 'mock',
					name: 'Mock',
					visible: true,
					repos: []
				}
			});
		});

	});

	describe('repoListing.categorise(repos)', () => {
		let categoryMap;
		let repos;
		let returnValue;

		beforeEach(() => {
			categoryMap = {
				mock: {repos: []},
				imagesets: {repos: []},
				services: {repos: []},
				uncategorised: {repos: []}
			};
			repos = [
				{
					name: 'testing module with sub-type',
					type: 'module',
					subType: 'mock',
					visible: true
				},
				{
					name: 'testing module with no sub-type',
					type: 'module',
					subType: null,
					visible: false
				},
				{
					name: 'testing module with nonexistent sub-type',
					type: 'module',
					subType: 'nonexistent',
					visible: true
				},
				{
					name: 'testing repo with no type or sub-type',
					type: null,
					subType: null,
					visible: false
				},
				{
					name: 'testing imageset',
					type: 'imageset',
					subType: null,
					visible: false
				},
				{
					name: 'testing service',
					type: 'service',
					subType: null,
					visible: true
				}
			];
			sinon.stub(repoListing, 'buildCategoryMap').returns(categoryMap);
			returnValue = repoListing.categorise(repos);
		});

		it('builds a category map', () => {
			assert.calledOnce(repoListing.buildCategoryMap);
			assert.calledWith(repoListing.buildCategoryMap, [
				'primitives',
				'components',
				'layouts',
				'utilities',
				'imagesets',
				'services',
				'uncategorised'
			]);
		});

		it('returns the repos sorted into the expected categories', () => {
			assert.strictEqual(returnValue, categoryMap);
			assert.deepEqual(returnValue.mock.repos, [repos[0]]);
			assert.deepEqual(returnValue.imagesets.repos, [repos[4]]);
			assert.deepEqual(returnValue.services.repos, [repos[5]]);
			assert.deepEqual(returnValue.uncategorised.repos, [repos[1], repos[2], repos[3]]);
		});

		it('sets each category visibility based on the visibility of the repos it contains', () => {
			assert.isTrue(returnValue.mock.visible);
			assert.isFalse(returnValue.imagesets.visible);
			assert.isTrue(returnValue.services.visible);
			assert.isTrue(returnValue.uncategorised.visible);
		});

	});

	describe('repoListing.markVisibilityBySearchTerm(repos, search)', () => {
		let repos;
		let returnValue;

		beforeEach(() => {
			repos = [
				{
					name: 'mock repo foo',
					keywords: ['one', 'two']
				},
				{
					name: 'mock repo bar',
					keywords: ['two', 'three']
				},
				{
					name: 'mock repo baz',
					keywords: ['foo']
				},
				{
					name: 'mock repo foo bar baz',
					keywords: ['one', 'two', 'three'],
					visible: false
				}
			];
		});

		describe('when `search` matches the name of a repo', () => {

			beforeEach(() => {
				returnValue = repoListing.markVisibilityBySearchTerm(repos, 'bar');
			});

			it('marks the repos with the expected visibility', () => {
				assert.deepEqual(returnValue, [repos[0], repos[1], repos[2], repos[3]]);
				assert.isFalse(repos[0].visible);
				assert.isTrue(repos[1].visible);
				assert.isFalse(repos[2].visible);
				assert.isFalse(repos[3].visible);
			});

		});

		describe('when `search` matches a keyword in a repo', () => {

			beforeEach(() => {
				returnValue = repoListing.markVisibilityBySearchTerm(repos, 'three');
			});

			it('marks the repos with the expected visibility', () => {
				assert.deepEqual(returnValue, [repos[0], repos[1], repos[2], repos[3]]);
				assert.isFalse(repos[0].visible);
				assert.isTrue(repos[1].visible);
				assert.isFalse(repos[2].visible);
				assert.isFalse(repos[3].visible);
			});

		});

		describe('when `search` matches a name in one repo and and a keyword in another', () => {

			beforeEach(() => {
				returnValue = repoListing.markVisibilityBySearchTerm(repos, 'foo');
			});

			it('marks the repos with the expected visibility', () => {
				assert.deepEqual(returnValue, [repos[0], repos[1], repos[2], repos[3]]);
				assert.isTrue(repos[0].visible);
				assert.isFalse(repos[1].visible);
				assert.isTrue(repos[2].visible);
				assert.isFalse(repos[3].visible);
			});

		});

		describe('when `search` matches a partial name in a repo', () => {

			beforeEach(() => {
				returnValue = repoListing.markVisibilityBySearchTerm(repos, 'ar');
			});

			it('marks the repos with the expected visibility', () => {
				assert.deepEqual(returnValue, [repos[0], repos[1], repos[2], repos[3]]);
				assert.isFalse(repos[0].visible);
				assert.isTrue(repos[1].visible);
				assert.isFalse(repos[2].visible);
				assert.isFalse(repos[3].visible);
			});

		});

		describe('when `search` matches a partial name in a keyword', () => {

			beforeEach(() => {
				returnValue = repoListing.markVisibilityBySearchTerm(repos, 'ree');
			});

			it('marks the repos with the expected visibility', () => {
				assert.deepEqual(returnValue, [repos[0], repos[1], repos[2], repos[3]]);
				assert.isFalse(repos[0].visible);
				assert.isTrue(repos[1].visible);
				assert.isFalse(repos[2].visible);
				assert.isFalse(repos[3].visible);
			});

		});

		describe('when `search` is not a string', () => {

			beforeEach(() => {
				repos = [
					{
						name: 'mock repo'
					}
				];
				returnValue = repoListing.markVisibilityBySearchTerm(repos, []);
			});

			it('returns the repos unmodified', () => {
				assert.strictEqual(returnValue, repos);
				assert.isUndefined(repos[0].visible);
			});

		});

		describe('when `search` is string that only contains whitespace', () => {

			beforeEach(() => {
				repos = [
					{
						name: 'mock repo'
					}
				];
				returnValue = repoListing.markVisibilityBySearchTerm(repos, '     ');
			});

			it('returns the repos unmodified', () => {
				assert.strictEqual(returnValue, repos);
				assert.isUndefined(repos[0].visible);
			});

		});

		describe('when `search` is an empty string', () => {

			beforeEach(() => {
				repos = [
					{
						name: 'mock repo'
					}
				];
				returnValue = repoListing.markVisibilityBySearchTerm(repos, '');
			});

			it('returns the repos unmodified', () => {
				assert.strictEqual(returnValue, repos);
				assert.isUndefined(repos[0].visible);
			});

		});

	});

	describe('repoListing.markVisibilityByType(repos, types)', () => {
		let repos;
		let returnValue;

		beforeEach(() => {
			repos = [
				{
					name: 'testing repo to be marked as visible',
					type: 'mockType1'
				},
				{
					name: 'testing repo already marked as not visible',
					type: 'mockType1',
					visible: false
				},
				{
					name: 'testing repo not to be marked as visible',
					type: 'mockType2'
				}
			];
			returnValue = repoListing.markVisibilityByType(repos, {
				mockType1: true,
				mockType2: false
			});
		});

		it('marks the repos with the expected visibility', () => {
			assert.deepEqual(returnValue, [repos[0], repos[1], repos[2]]);
			assert.isTrue(repos[0].visible);
			assert.isFalse(repos[1].visible);
			assert.isFalse(repos[2].visible);
		});

		describe('when `types` is invalid', () => {

			beforeEach(() => {
				repos = [
					{
						name: 'mock repo'
					}
				];
				returnValue = repoListing.markVisibilityByType(repos, 'invalid');
			});

			it('returns the repos unmodified', () => {
				assert.strictEqual(returnValue, repos);
				assert.isUndefined(repos[0].visible);
			});

		});

	});

	describe('repoListing.markVisibilityByStatus(repos, statuses)', () => {
		let repos;
		let returnValue;

		beforeEach(() => {
			repos = [
				{
					name: 'testing repo to be marked as visible',
					support: {
						status: 'mockStatus1'
					}
				},
				{
					name: 'testing repo already marked as not visible',
					support: {
						status: 'mockStatus1'
					},
					visible: false
				},
				{
					name: 'testing repo not to be marked as visible',
					support: {
						status: 'mockStatus2'
					}
				}
			];
			returnValue = repoListing.markVisibilityByStatus(repos, {
				mockStatus1: true,
				mockStatus2: false
			});
		});

		it('marks the repos with the expected visibility', () => {
			assert.deepEqual(returnValue, [repos[0], repos[1], repos[2]]);
			assert.isTrue(repos[0].visible);
			assert.isFalse(repos[1].visible);
			assert.isFalse(repos[2].visible);
		});

		describe('when `statuses` is invalid', () => {

			beforeEach(() => {
				repos = [
					{
						name: 'mock repo'
					}
				];
				returnValue = repoListing.markVisibilityByStatus(repos, 'invalid');
			});

			it('returns the repos unmodified', () => {
				assert.deepEqual(returnValue, [repos[0]]);
				assert.isUndefined(repos[0].visible);
			});

		});

	});

	describe('repoListing.markVisibilityByBrand(repos, brand)', () => {
		let repos;
		let returnValue;

		beforeEach(() => {
			repos = [
				{
					name: 'testing repo to be marked as visible',
					brands: []
				},
				{
					name: 'testing repo already marked as not visible',
					brands: null,
					visible: false
				},
				{
					name: 'testing repo not to be marked as visible',
					brands: ['master', 'mockBrand1']
				}
			];
			returnValue = repoListing.markVisibilityByBrand(repos, 'mockBrand1');
		});

		it('marks the repos with the expected visibility', () => {
			assert.deepEqual(returnValue, [repos[0], repos[1], repos[2]]);
			assert.isFalse(repos[0].visible);
			assert.isFalse(repos[1].visible);
			assert.isTrue(repos[2].visible);
		});

		describe('when repo.brands is `null` or []', () => {
			beforeEach(() => {
				repos = [
					{
						name: 'testing repo to be marked as visible',
						brands: []
					},
					{
						name: 'testing repo already marked as not visible',
						brands: null
					},
					{
						name: 'testing repo not to be marked as visible',
						brands: ['master', 'mockBrand1']
					}
				];
				returnValue = repoListing.markVisibilityByBrand(repos, 'master');
			});

			it('sets visibility to true if brand default (master) and repo.visible is not false', () => {
				assert.isTrue(returnValue[0].visible);
				assert.isTrue(returnValue[1].visible);
				assert.isTrue(returnValue[2].visible);
			});

		});

	});
});
