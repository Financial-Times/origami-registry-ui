

module.exports = {
	init: function () {
		const selections = document.querySelectorAll('[data-version-select]');
		selections.forEach(selection => selection.addEventListener('change', (event) => {
			// Get a redirect location from the selected option.
			const newLoaction = event.target.selectedOptions.item(0).getAttribute('data-redirect');
			// The selection is cached by the browser, which is misleading when the back/forward
			// buttons are hit. So reset the selection to what it was before redirecting.
			selection.querySelector('[selected="true"]').selected = true;
			// Go to the selected page.
			location.href = newLoaction;
		}));
	}
};
