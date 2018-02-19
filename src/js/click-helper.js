'use strict';

module.exports = (function() {
	const links = document.querySelectorAll('.o-registry-ui__table-cell--link');
	Array.from(links, link => {
		const row = link.parentNode.parentNode;
		if (link.href) {
			row.addEventListener('click', () => { location.href = link.href; });
		}
	});
}());
