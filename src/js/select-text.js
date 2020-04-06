'use strict';

function selectText(element) {
	let range;
	let selection;

	if (document.body.createTextRange) { //support IE
		range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) { //support everything else
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

module.exports.init = function() {
	const buttons = document.querySelectorAll('[data-select-html]');
	if (buttons) {
		buttons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault;
				const id = button.getAttribute('data-select-html');
				const html = document.getElementById(id);
				selectText(html);
			});
		});
	}
};
