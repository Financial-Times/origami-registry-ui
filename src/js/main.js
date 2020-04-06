'use strict';

import SelectText from './select-text';
import Versioning from './versioning';
import FilterableNav from './filterable-nav';
import ComponentListing from './component-listing';
import FilterForm from './filter-form';

// Initialise components
document.addEventListener('o.DOMContentLoaded', () => {
    FilterableNav.init();
    ComponentListing.init();
    FilterForm.init();
    Versioning.init();
    SelectText.init();
});
