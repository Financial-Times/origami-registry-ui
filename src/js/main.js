'use strict';

require('o-syntax-highlight');
require('./click-helper');
require('./demo');
require('./select-text');
require('./sticky-scroll');
require('./versioning');

const FilterableNav = require('./filterable-nav');
const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');
const LinkedHeading = require('./linked-heading');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	FilterableNav.init();
	ComponentListing.init();
	FilterForm.init();
	LinkedHeading.init();
});
