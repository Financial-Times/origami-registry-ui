'use strict';

module.exports = (function() {
	const brandTabs = document.querySelectorAll('.registry__component--brand-tabs > li');


	Array.from(brandTabs, tab => {
		tab.addEventListener('click', () => {
			const brand = tab.firstElementChild.innerHTML;
			location.href = `${location.origin}${location.pathname}?brand=${brand}`;
		});
	});
}());
