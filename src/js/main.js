'use strict';

require('./click-helper');
require('./demo');
require('./versioning');
require('./highlight-HTML');

const ComponentListing = require('./component-listing');
const FilterForm = require('./filter-form');

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	ComponentListing.init();
	FilterForm.init();
});

// Dispatch the o.DOMContentLoaded event
if (document.readyState === 'interactive' || document.readyState === 'complete') {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
}
document.addEventListener('DOMContentLoaded', function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
