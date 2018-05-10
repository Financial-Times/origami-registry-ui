'use strict';

module.exports = (function() {
	const wrappers = document.querySelectorAll('.registry__container--wrapper');
	const header = document.querySelector('header');

	document.addEventListener('scroll', () => {
		Array.from(wrappers, wrapper => {
			if (wrapper && wrapper.offsetHeight >= window.innerHeight) {
				wrapper.style.overflowY = 'scroll';
				wrapper.style.position = (header.offsetHeight <= window.scrollY) ? 'fixed' : 'relative';
			}
		});
	});
}());
