'use strict';

function queryToRepoFilter(query) {
	const filter = {
		type: [],
		status: []
	};
	if (!query) {
		return filter;
	}
	if (query.search && query.search.trim()) {
		filter.search = query.search;
	}
	if (query.imageset) {
		filter.type.push('imageset');
	}
	if (query.module) {
		filter.type.push('module');
	}
	if (query.service) {
		filter.type.push('service');
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
	if (!filter.type.length) {
		delete filter.type;
	}
	if (!filter.status.length) {
		delete filter.status;
	}
	return filter;
}

module.exports = queryToRepoFilter;
