'use strict';

require('o-syntax-highlight');
require('prism/components/prism-diff.js');
require('prism/components/prism-scss.js');
require('prism/components/prism-css.js');
require('./click-helper');
require('./demo');
require('./select-text');
require('./sticky-scroll');
require('./versioning');
require('./readme');

const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');
const LinkedHeading = require('./linked-heading');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	ComponentListing.init();
	FilterForm.init();
	LinkedHeading.init();
});
