'use strict';

const capitalize = require('lodash/capitalize');

/**
 * Build a categories map from an array of category IDs.
 * @param {Array} categories - The categories to create a map for.
 * @return {Object} Returns an object where each key is a category ID and each value is a category.
 */
function buildRepoCategoryMap(categories) {
	return categories.reduce((categoryMap, categoryId) => {
		categoryMap[categoryId] = {
			id: categoryId,
			name: capitalize(categoryId),
			visible: true,
			repos: []
		};
		return categoryMap;
	}, {});
}

/**
 * Group a list of repositories into a categories.
 * @param {Array} repos - A list of repositories from the Repo Data API.
 * @return {Object} Returns an object where each key is a category ID and each value is a category.
 */
function categoriseRepos(repos) {
	const categoryMap = module.exports.buildCategoryMap([
		'primitives',
		'components',
		'layouts',
		'utilities',
		'imagesets',
		'services',
		'uncategorised'
	]);
	for (const repo of repos) {
		if (repo.subType === null) {
			if (repo.type === 'imageset') {
				categoryMap['imagesets'].repos.push(repo);
			} else if (repo.type === 'service') {
				categoryMap['services'].repos.push(repo);
			} else {
				categoryMap['uncategorised'].repos.push(repo);
			}
		} else {
			if (categoryMap[repo.subType]) {
				categoryMap[repo.subType].repos.push(repo);
			} else {
				categoryMap['uncategorised'].repos.push(repo);
			}
		}
	}
	for (const category of Object.values(categoryMap)) {
		category.visible = category.repos.some(repo => repo.visible);
	}
	return categoryMap;
}

/**
 * Mark repositories as visible or not using a string search term.
 * @param {Array} repos - A list of repositories from the Repo Data API.
 * @param {String} search - The search term.
 * @return {Array} Returns the list of repositories.
 */
function markVisibilityBySearchTerm(repos, search) {
	search = (typeof search === 'string' ? search.trim() : '');

	// If search is not a string or is empty, just return the repos
	if (!search) {
		return repos;
	}

	// Create a regular expression for the search
	const regExpSafeQuery = search.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	const searchRegExp = new RegExp(`${regExpSafeQuery}`, 'i');
	const test = searchRegExp.test.bind(searchRegExp);

	// Return a filtered list of repos
	return repos.map(repo => {

		// If the repo is already hidden, don't update it
		if (repo.visible === false) {
			return repo;
		}

		// Match against repo name and keywords
		const thingsToMatch = [repo.name].concat(repo.keywords);
		repo.visible = thingsToMatch.some(test);

		return repo;
	});
}

/**
 * Mark repositories as visible or not using repo type.
 * @param {Array} repos - A list of repositories from the Repo Data API.
 * @param {Object} types - The types to allow.
 * @param {Boolean} [types.imageset] - Include imageset repos in the output.
 * @param {Boolean} [types.module] - Include module repos in the output.
 * @param {Boolean} [types.service] - Include service repos in the output.
 * @return {Array} Returns the list of repositories.
 */
function markVisibilityByType(repos, types) {
	types = (typeof types === 'object' ? types : null);

	// If types is null, just return the repos
	if (types === null) {
		return repos;
	}

	// Return a filtered list of repos
	return repos.filter(repo => {

		// If the repo is already hidden, don't update it
		if (repo.visible === false) {
			return repo;
		}

		// Match against repo types
		repo.visible = Boolean(types[repo.type]);

		return repo;
	});
}

/**
 * Mark repositories as visible or not using repo status.
 * @param {Array} repos - A list of repositories from the Repo Data API.
 * @param {Object} statuses - The statuses to allow.
 * @param {Boolean} [statuses.active] - Include active repos in the output.
 * @param {Boolean} [statuses.dead] - Include dead repos in the output.
 * @param {Boolean} [statuses.deprecated] - Include deprecated repos in the output.
 * @param {Boolean} [statuses.experimental] - Include experimental repos in the output.
 * @param {Boolean} [statuses.maintained] - Include maintained repos in the output.
 * @return {Array} Returns the list of repositories.
 */
function markVisibilityByStatus(repos, statuses) {
	statuses = (typeof statuses === 'object' ? statuses : null);

	// If statuses is null, just return the repos
	if (statuses === null) {
		return repos;
	}

	// Return a filtered list of repos
	return repos.filter(repo => {

		// If the repo is already hidden, don't update it
		if (repo.visible === false) {
			return repo;
		}

		// Match against repo types
		repo.visible = Boolean(statuses[repo.support.status]);
		return repo;
	});
}

/**
 * Mark repositories as visible or not using repo brand support.
 * @param {Array} repos - A list of repositories from the Repo Data API.
 * @param {Boolean} [brand] - If internal is ticked, include it in the output.
 * @return {Array} Returns the list of repositories.
 */
function markVisibilityByBrand(repos, brand) {
	// Return a filtered list of repos
	return repos.filter(repo => {
		// If the repo is already hidden, don't update it
		if (repo.visible === false) {
			return repo;
		}

		// If repo.brands doesn't exist, default to master
		repo.visible = (brand === 'master') ? true : false;

		if (repo.brands && repo.brands.length > 0) {
			repo.visible = repo.brands.includes(brand);
		}
		return repo;
	});
}

module.exports = {
	buildCategoryMap: buildRepoCategoryMap,
	categorise: categoriseRepos,
	defaultFilter: {
		active: true,
		brand: 'master',
		experimental: true,
		imageset: true,
		maintained: true,
		module: true,
		search: '',
		service: true
	},
	markVisibilityBySearchTerm: markVisibilityBySearchTerm,
	markVisibilityByStatus: markVisibilityByStatus,
	markVisibilityByType: markVisibilityByType,
	markVisibilityByBrand: markVisibilityByBrand
};
