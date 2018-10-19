'use strict';

module.exports = (function() {
	const stickyElements = document.querySelectorAll('.registry__container__sticky');

	const updateStickyScroll = () => {
		Array.from(stickyElements, element => {
			// Scroll page rather than element unless the element has stuck.
			if (element.parentElement.getBoundingClientRect().top > 0) {
				element.scrollTop = 0;
				element.style['overflow-x'] = 'unset';
			} else {
				element.style['overflow-x'] = 'hidden';
			}
		});
	};

	document.addEventListener('scroll', () => window.requestAnimationFrame(updateStickyScroll));
	updateStickyScroll();
}());
