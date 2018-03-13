'use strict';

/**
 * Represents a filterable component heading.
 */
class LinkedHeading {

	/**
	 * Class constructor.
	 * @param {HTMLElement} [headingElement] - The heading element in the DOM.
	 */
	constructor(headingElement) {
		this.headingElement = headingElement;
		this.id = headingElement.getAttribute('id');
		this.buildLink();
	}

	/**
	 * Build the heading link.
	 */
	buildLink() {
		if (this.id) {
			this.link = document.createElement('a');
			this.link.setAttribute('href', `#${this.id}`);
			this.link.setAttribute('title', 'Link directly to this section of the page');
			this.link.innerHTML = '&nbsp;¶';
			this.link.classList.add('registry__linked-heading__permalink');
			this.headingElement.innerHTML = this.headingElement.innerHTML.trim();
			this.headingElement.appendChild(this.link);
		}
	}

	/**
	 * Initialise heading components.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise filter forms in, or a CSS selector for the root element.
	 * @param {Object} [options={}] - An options object for configuring the heading.
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
		// AND the rootElement has the data-o-component=o-linked-heading then initialise just 1 heading (this one)
		if (rootElement instanceof HTMLElement && /\bo-linked-heading\b/.test(rootElement.getAttribute('data-o-component'))) {
			return new LinkedHeading(rootElement, options);
		}

		// If the rootElement wasn't itself a heading, then find ALL of the child things that have the data-o-component=oLinkedHeading set
		return Array.from(rootElement.querySelectorAll('[data-o-component="o-linked-heading"]'), rootElement => new LinkedHeading(rootElement, options));
	}

}

// Exports
module.exports = LinkedHeading;
