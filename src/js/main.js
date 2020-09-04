

import SelectText from './select-text.js';
import Versioning from './versioning.js';
import FilterableNav from './filterable-nav.js';
import ComponentListing from './component-listing.js';
import FilterForm from './filter-form.js';

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
	FilterableNav.init();
	ComponentListing.init();
	FilterForm.init();
	Versioning.init();
	SelectText.init();
});
