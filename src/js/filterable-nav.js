


function setNavVisibility(navElement, searchTerm) {
	// Create search Regex.
	searchTerm = typeof searchTerm === 'string' ? searchTerm.trim() : '';
	const regExpSafeQuery = searchTerm.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	const searchRegExp = new RegExp(`${regExpSafeQuery}`, 'i');
	// Given nav is hidden unless it has a visible item.
	const items = Array.from(navElement.children).filter(element => element.tagName === 'LI');
	const navVisible = items.reduce((navVisible, item) => {
		// Check item against query.
		const itemMatches = !searchTerm || searchRegExp.test(item.textContent) ? true : false;
		// Check subnavs against query.
		const subNavs = Array.from(item.children).filter(element => element.tagName === 'UL' || element.tagName === 'OL');
		const itemHasVisibleSubnav = subNavs.reduce((itemHasVisibleSubnav, subNav) => {
			const subnavVisible = setNavVisibility(subNav, searchTerm);
			return subnavVisible ? true : itemHasVisibleSubnav;
		}, false);
		// Show item if it has a link which matches the query, or if it has a visible subnav.
		const hasAnchor = Array.from(item.children).filter(element => element.tagName === 'A').length > 0;
		const itemVisible = itemMatches && hasAnchor || itemHasVisibleSubnav;
		item.setAttribute('aria-hidden', itemVisible ? 'false' : 'true');
		// Show the nav if an item is visible.
		return itemVisible ? true : navVisible;
	}, false);
	// Set nav visibility.
	navElement.setAttribute('aria-hidden', navVisible ? 'false' : 'true');
	return navVisible;
}

/**
 * Represents a filterable nav.
 */
class FilterableNav {
	constructor(navElement) {
		const formId = navElement.getAttribute('data-filterable-nav');
		const formElement = document.querySelector(`#${formId}`);
		if (!formElement) {
			throw new Error(`Could not find a form by id "#${formId}" for an input to filter the nav.`);
		}
		const inputElement = formElement.querySelector('input');
		if (!inputElement) {
			throw new Error(`Could not find an input in form "#${formId}" to filter the nav.`);
		}
		inputElement.addEventListener('input', event => this.filterNav(event.target.value));
		formElement.addEventListener('submit', event => this.feelingLucky(event));
		this.navElement = navElement;
		this.inputElement = inputElement;
	}

	filterNav(searchTerm) {
		setNavVisibility(this.navElement, searchTerm);
	}

	feelingLucky(event) {
		event.preventDefault();
		const selector = 'ul:not([aria-hidden="true"]) li:not([aria-hidden="true"]) > a:first-of-type';
		const firstLink = this.navElement.querySelector(selector);
		if (firstLink) {
			window.location = firstLink.getAttribute('href');
		}
	}

	static init(rootEl) {
		if (!rootEl) {
			rootEl = document.body;
		}
		if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		if (rootEl instanceof HTMLElement && rootEl.getAttribute('data-filterable-nav')) {
			return new FilterableNav(rootEl);
		}
		return Array.from(rootEl.querySelectorAll('[data-filterable-nav]'), rootEl => new FilterableNav(rootEl));
	}
}

module.exports = FilterableNav;
