

/**
 * Represents a filterable component listing.
 */
class ComponentListing {

	/**
	 * Class constructor.
	 * @param {HTMLElement} [listingElement] - The listing element in the DOM.
	 */
	constructor(listingElement) {
		this.listingElement = listingElement;
		document.addEventListener('o.filterFormInitSearch', this.handleFilterFormInitSearchEvent.bind(this));
		document.addEventListener('o.filterFormSuccess', this.handleFilterFormSuccessEvent.bind(this));
		document.addEventListener('o.filterFormError', this.handleFilterFormErrorEvent.bind(this));
	}

	/**
	 * Handle the filter form initialise search event.
	 */
	handleFilterFormInitSearchEvent() {
		this.listingElement.classList.add('registry-component-list--loading');
		this.listingElement.setAttribute('aria-busy', 'true');
	}

	/**
	 * Handle the filter form success event.
	 */
	handleFilterFormSuccessEvent(event) {
		this.listingElement.innerHTML = event.detail.repos.map(repo => repo.listItemHtml).join('');
		this.listingElement.removeAttribute('aria-busy');
	}

	/**
	 * Handle the filter form error event.
	 */
	handleFilterFormErrorEvent() {
		// TODO should we present this error message?
		this.listingElement.removeAttribute('aria-busy');
	}

	/**
	 * Initialise listing components.
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
		// AND the rootElement has the data-o-component=o-component-listing then initialise just 1 listing (this one)
		if (rootElement instanceof HTMLElement && /\bo-component-listing\b/.test(rootElement.getAttribute('data-o-component'))) {
			return new ComponentListing(rootElement, options);
		}

		// If the rootElement wasn't itself a listing, then find ALL of the child things that have the data-o-component=oComponentListing set
		return Array.from(rootElement.querySelectorAll('[data-o-component="o-component-listing"]'), rootElement => new ComponentListing(rootElement, options));
	}

}

// Exports
export default ComponentListing;
