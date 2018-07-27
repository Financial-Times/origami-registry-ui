'use strict';

require('o-syntax-highlight');
require('prism/components/prism-scss.js');
require('./click-helper');
require('./demo');
require('./select-text');
require('./sticky-scroll');
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
