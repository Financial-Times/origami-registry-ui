'use strict';

module.exports = (function () {
	const selection = document.querySelector('.version__select');
	if (selection) {
		selection.addEventListener('change', () => {
			location.href = selection.value + location.search;
		});
	}
}());
