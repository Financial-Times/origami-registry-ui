'use strict';

require('./click-helper');
require('./demo');
require('./select-text');
require('./versioning');

const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');
const hljs = require('highlight.js');
const LinkedHeading = require('./linked-heading');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	ComponentListing.init();
	FilterForm.init();
	hljs.initHighlighting();
	LinkedHeading.init();
});

// Dispatch the o.DOMContentLoaded event
if (document.readyState === 'interactive' || document.readyState === 'complete') {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
}
document.addEventListener('DOMContentLoaded', function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
