'use strict';

module.exports = (function() {
	const brandTabs = document.querySelectorAll('.registry__component--brand-tabs > li');


	Array.from(brandTabs, tab => {
		tab.addEventListener('click', () => {
			const brand = tab.firstElementChild.innerHTML;
			const baseUri = location.origin + location.pathname;
			location.href = (brand === 'master') ? baseUri : `${baseUri}?brand=${brand}`;
		});
	});
}());
