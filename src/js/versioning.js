'use strict';

module.exports = (function () {
	const selection = document.querySelector('.registry__select');
	if (selection) {
		selection.addEventListener('change', () => { location.href = selection.value; });
	}
}());
