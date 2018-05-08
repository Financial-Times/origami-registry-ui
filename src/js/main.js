'use strict';

require('./click-helper');
require('./demo');
require('./select-text');
require('./sticky-scroll');
require('./tabs');
require('./versioning');

const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');
const LinkedHeading = require('./linked-heading');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	ComponentListing.init();
	FilterForm.init();
	LinkedHeading.init();
});
