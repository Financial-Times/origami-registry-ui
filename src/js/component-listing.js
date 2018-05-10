'use strict';

const repoListing = require('../../lib/repo-listing');

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
		this.components = this.getComponents();
		this.categoryElements = this.getCategoryElements();
		document.addEventListener('o.filterFormUpdate', this.handleFilterFormUpdateEvent.bind(this));
	}

	/**
	 * Handle the filter form update event.
	 */
	handleFilterFormUpdateEvent(event) {
		const filter = event.detail;
		// Perform the visibility marking
		this.components = this.components.map(component => {

			component.visible = true;
			return component;
		});

		if (filter.search !== undefined) {
			this.components = repoListing.markVisibilityBySearchTerm(this.components, filter.search);
		}

		if (filter.module !== undefined) {
			this.components = repoListing.markVisibilityByType(this.components, {
				imageset: filter.imageset,
				module: filter.module,
				service: filter.service
			});
		}

		if (filter.active !== undefined) {
			this.components = repoListing.markVisibilityByStatus(this.components, {
				active: filter.active,
				dead: filter.dead,
				deprecated: filter.deprecated,
				experimental: filter.experimental,
				maintained: filter.maintained
			});
		}

		// Feeling lucky? Just click the first result
		if (filter.feelingLucky) {
			const firstVisibleComponent = this.components.find(component => component.visible);
			if (firstVisibleComponent) {
				const link = firstVisibleComponent.element.querySelector('a');
				const address = (link ? link.getAttribute('href') : null);
				if (address) {
					document.location = address;
					return;
				}
			}
		}

		// Set classes and attributes
		for (const component of this.components) {
			if (component.visible) {
				component.element.removeAttribute('aria-hidden');
				component.element.classList.remove('registry__component-listing--hidden');
			} else {
				component.element.setAttribute('aria-hidden', 'true');
				component.element.classList.add('registry__component-listing--hidden');
			}
		}
		for (const [categoryName, category] of Object.entries(repoListing.categorise(this.components))) {
			if (category.visible) {
				this.categoryElements[categoryName].removeAttribute('aria-hidden');
				this.categoryElements[categoryName].classList.remove('registry__component-listing--hidden');
			} else {
				this.categoryElements[categoryName].setAttribute('aria-hidden', 'true');
				this.categoryElements[categoryName].classList.add('registry__component-listing--hidden');
			}
		}
	}

	/**
	 * Get the list of components.
	 */
	getComponents() {
		const elements = this.listingElement.querySelectorAll('[data-o-component-name]');
		return Array.from(elements, element => {
			return {
				name: element.getAttribute('data-o-component-name'),
				keywords: JSON.parse(element.getAttribute('data-o-component-keywords')),
				type: element.getAttribute('data-o-component-type'),
				subType: element.getAttribute('data-o-component-sub-type') || null,
				support: {
					status: element.getAttribute('data-o-component-support-status')
				},
				element
			};
		});
	}

	/**
	 * Get the component categories.
	 */
	getCategoryElements() {
		const elements = this.listingElement.querySelectorAll('[data-o-component-category]');
		return Array.from(elements).reduce((categoryMap, element) => {
			categoryMap[element.getAttribute('data-o-component-category')] = element;
			return categoryMap;
		}, {});
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
module.exports = ComponentListing;
