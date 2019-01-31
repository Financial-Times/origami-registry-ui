'use strict';

module.exports = {
	init: function () {
		const selections = document.querySelectorAll('[data-version-select]');
		selections.forEach(selection => selection.addEventListener('change', (event) => {
			location.href = event.target.selectedOptions.item(0).getAttribute('data-redirect');
		}));
	}
};
