'use strict';

require('./click-helper');
require('./demo');
require('./select-text');
require('./versioning');

const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');
const hljs = require('highlight.js');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	ComponentListing.init();
	FilterForm.init();
	hljs.initHighlighting();
});
