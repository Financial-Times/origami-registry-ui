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

		this.alterBrowserHistory = Boolean(formElement.getAttribute('data-o-filter-form-browser-history'));
		if (this.alterBrowserHistory) {
			window.addEventListener('popstate', this.handlePopStateEvents.bind(this));
		}

		// Bind and set up event handlers
		this.handleFormChangeEvent = this.handleFormChangeEvent.bind(this);
		this.handleFormChangeEventImmediate = this.handleFormChangeEventImmediate.bind(this);
		this.handleFormChangeEventDebounced = debounce(this.handleFormChangeEventImmediate, 400);

		this.formElement.addEventListener('submit', this.handleFormChangeEvent);
		this.formElement.addEventListener('input', this.handleFormChangeEvent);
		this.formElement.addEventListener('change', this.handleFormChangeEvent);
	}

	/**
	 * Handle the form changing events, switching between immediate and debounced variants.
	 */
	handleFormChangeEvent(event) {
		if (event) {
			event.preventDefault();
			if (event.type === 'submit') {
				return this.handleFormChangeEventImmediate(event);
			}
		}
		this.handleFormChangeEventDebounced(event);
	}

	/**
	 * Handle the form changing events immediately.
	 */
	handleFormChangeEventImmediate(event) {
		const queryString = this.getUrlEncodedFilterValues();
		const feelingLucky = event && event.type === 'submit';

		// If the filters haven't changed, exit early. Otherwise
		// set the last filter to the new value
		if (this.lastFilter === queryString && !feelingLucky) {
			return;
		}
		this.lastFilter = queryString;

		// Perform the search
		return this.searchForRepos(feelingLucky).then(() => {
			if (this.alterBrowserHistory) {
				window.history.pushState({
					oFilterFormFilters: this.getFilterValues()
				}, '', `?${queryString}`);
			}
		});
	}

	/**
	 * Search for repositories based on a set of filters
	 */
	searchForRepos(feelingLucky) {
		const loadingClass = 'registry__form--loading';
		this.formElement.classList.add(loadingClass);
		document.dispatchEvent(new CustomEvent('o.filterFormInitSearch'));
		return fetch(`/components.json?${this.getUrlEncodedFilterValues()}`)
			.then(response => {
				return response.json();
			})
			.then(repos => {
				if (feelingLucky && repos.length) {
					document.location = `/components/${repos[0].name}@${repos[0].version}`;
					return;
				}
				this.formElement.classList.remove(loadingClass);
				document.dispatchEvent(new CustomEvent('o.filterFormSuccess', {
					detail: {
						repos
					}
				}));
			})
			.catch(error => {
				this.formElement.classList.remove(loadingClass);
				document.dispatchEvent(new CustomEvent('o.filterFormError', {
					detail: {
						error
					}
				}));
			});
	}

	/**
	 * Handle the window push-state changing.
	 */
	handlePopStateEvents(event) {
		let filter = {};
		if (event.state && event.state.oFilterFormFilters) {
			filter = event.state.oFilterFormFilters;
		} else if (document.location.search) {
			filter = parseQueryString(document.location.search);
		}
		this.setFilterValues(filter);
		this.handleFormChangeEvent();
	}

	/**
	 * Set the filter values.
	 */
	setFilterValues(filter) {
		this.inputs.forEach(input => {
			const name = input.getAttribute('name');
			const type = input.getAttribute('type');
			if (name) {
				if (type === 'checkbox') {
					input.checked = filter[name];
				} else if (type === 'radio' && input.getAttribute('value' === filter[name])) {
					input.checked = true;
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
			const type = input.getAttribute('type');
			if (name) {
				if (type === 'checkbox') {
					values[name] = input.checked ? 'true' : '';
				} else if (type === 'radio') {
					if (input.checked) {
						values[name] = input.value;
					}
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
			.filter(entry => {
				const value = entry[1];
				return Boolean(value);
			})
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
export default FilterForm;
