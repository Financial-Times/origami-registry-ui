'use strict';

module.exports = (function() {
	const links = document.querySelectorAll('.registry__group-item--link');
	Array.from(links, link => {
		const row = link.parentNode.parentNode;
		if (link.href) {
			row.addEventListener('click', (e) => {
				e.preventDefault();
				if (e.metaKey || e.ctrlKey || e.which === 2) {
					window.open(link.href, '_blank');
				} else {
					location.href = link.href;
				}
			});
		}
	});
}());
