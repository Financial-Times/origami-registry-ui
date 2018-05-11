'use strict';

module.exports = (function() {
	const wrappers = document.querySelectorAll('.registry__container--wrapper');
	const header = document.querySelector('header');
	const footer = document.querySelector('footer');

	document.addEventListener('scroll', () => {
		Array.from(wrappers, wrapper => {
			if (wrapper && wrapper.offsetHeight >= window.innerHeight) {
				if ((wrapper.offsetHeight + window.scrollY) > footer.offsetTop) {
					wrapper.classList.remove('registry__container--sticky');
				} else if (header.offsetHeight <= window.scrollY) {
					wrapper.classList.add('registry__container--sticky');
				} else {
					wrapper.classList.remove('registry__container--sticky');
				}
			}

		});
	});
}());
