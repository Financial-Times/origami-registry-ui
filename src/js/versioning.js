'use strict';

module.exports = (function () {
	const selection = document.querySelector('.o-registry-ui__select');
	selection.addEventListener('change', () => { location.href = selection.value; });
}());
