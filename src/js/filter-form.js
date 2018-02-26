'use strict';

const repoListing = require('../../lib/repo-listing');

// Simple debounce function for throttling input
function debounce(fn, delay) {
	let timer = null;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
}

// Debounced static push state
const debouncedPushState = debounce((data, url) => {
	window.history.pushState(data, '', url);
}, 600);

// Simple query string parsing
function parseQueryString(queryString) {
	return queryString.replace(/^\?/, '').split('&').reduce((parsed, param) => {
		const [key, ...value] = param.split('=');
		parsed[decodeURIComponent(key)] = decodeURIComponent(value.join('='));
		return parsed;
	}, {});
}

/**
 * Represents a filter form.
 */
class FilterForm {

	/**
	 * Class constructor.
	 * @param {HTMLElement} [formElement] - The filter form element in the DOM.
	 */
	constructor(formElement) {
		this.formElement = formElement;
		this.inputs = Array.from(formElement.querySelectorAll('input'));
		this.lastFilter = this.getUrlEncodedFilterValues();

		this.alterBrowserHistory = Boolean(formElement.getAttribute('o-filter-form-browser-history'));
		if (this.alterBrowserHistory) {
			window.addEventListener('popstate', this.handlePopStateEvents.bind(this));
		}

		const handleFormChangeEvent = this.handleFormChangeEvent.bind(this);
		this.formElement.addEventListener('submit', handleFormChangeEvent);
		this.formElement.addEventListener('input', handleFormChangeEvent);
		this.formElement.addEventListener('change', handleFormChangeEvent);
	}

	/**
	 * Handle the form changing events.
	 */
	handleFormChangeEvent() {
		const queryString = this.getUrlEncodedFilterValues();
		if (this.lastFilter !== queryString) {
			this.lastFilter = queryString;
			this.triggerFilterEvent();
			if (this.alterBrowserHistory) {
				debouncedPushState({
					oFilterFormFilters: this.getFilterValues()
				}, `?${queryString}`);
			}
		}
	}

	/**
	 * Handle the window push-state changing.
	 */
	handlePopStateEvents(event) {
		let filter;
		if (event.state && event.state.oFilterFormFilters) {
			filter = event.state.oFilterFormFilters;
		} else if (document.location.search) {
			filter = parseQueryString(document.location.search);
		} else {
			filter = repoListing.defaultFilter;
		}
		this.setFilterValues(filter);
		this.triggerFilterEvent();
	}

	/**
	 * Trigger the filter event
	 */
	triggerFilterEvent() {
		document.dispatchEvent(new CustomEvent('o.filterFormUpdate', {
			detail: this.getFilterValues()
		}));
	}

	/**
	 * Set the filter values.
	 */
	setFilterValues(filter) {
		this.inputs.forEach(input => {
			const name = input.getAttribute('name');
			if (name) {
				if (input.getAttribute('type') === 'checkbox') {
					input.checked = filter[name];
				} else {
					input.value = filter[name];
				}
			}
		});
	}

	/**
	 * Get the filter values.
	 */
	getFilterValues() {
		return this.inputs.reduce((values, input) => {
			const name = input.getAttribute('name');
			if (name) {
				if (input.getAttribute('type') === 'checkbox') {
					values[name] = input.checked ? 'true' : '';
				} else {
					values[name] = input.value;
				}
			}
			return values;
		}, {});
	}

	/**
	 * Get the filter values as a query string.
	 */
	getUrlEncodedFilterValues() {
		return Object.entries(this.getFilterValues())
			.map(([key, value]) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			})
			.join('&');
	}

	/**
	 * Initialise filter form components.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise filter forms in, or a CSS selector for the root element.
	 * @param {Object} [options={}] - An options object for configuring the filter forms.
	 */
	static init(rootElement, options) {
		if (!rootElement) {
			rootElement = document.body;
		}

		// If the rootElement isnt an HTMLElement, treat it as a selector
		if (!(rootElement instanceof HTMLElement)) {
			rootElement = document.querySelector(rootElement);
		}

		// If the rootElement is an HTMLElement (ie it was found in the document anywhere)
		// AND the rootElement has the data-o-component=o-filter-form then initialise just 1 filter form (this one)
		if (rootElement instanceof HTMLElement && /\bo-filter-form\b/.test(rootElement.getAttribute('data-o-component'))) {
			return new FilterForm(rootElement, options);
		}

		// If the rootElement wasn't itself a filter form, then find ALL of the child things that have the data-o-component=oFilterForm set
		return Array.from(rootElement.querySelectorAll('[data-o-component="o-filter-form"]'), rootElement => new FilterForm(rootElement, options));
	}

}

// Exports
module.exports = FilterForm;
