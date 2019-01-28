'use strict';

module.exports = (function () {
	const selections = document.querySelectorAll('[data-version-select]');
	selections.forEach(selection => selection.addEventListener('change', () => {
		location.href = selection.value;
	}));
}());
