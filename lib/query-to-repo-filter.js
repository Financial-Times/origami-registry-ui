'use strict';

function queryToRepoFilter(query) {
	const filter = {
		status: [],
	};
	if (!query) {
		return filter;
	}
	if (query.search && query.search.trim()) {
		filter.search = query.search;
	}
	if (query.type) {
		filter.type = query.type === 'component' ? 'module' : query.type;
	}
	if (query.active) {
		filter.status.push('active');
	}
	if (query.maintained) {
		filter.status.push('maintained');
	}
	if (query.experimental) {
		filter.status.push('experimental');
	}
	if (query.deprecated) {
		filter.status.push('deprecated');
	}
	if (query.dead) {
		filter.status.push('dead');
	}
	if (!filter.status.length) {
		delete filter.status;
	}
	return filter;
}

module.exports = queryToRepoFilter;
