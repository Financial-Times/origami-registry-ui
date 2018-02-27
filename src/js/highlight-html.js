'use strict';

const hljs = require('highlight.js');

class Highlight {

}


	/**
	 * Initialise highlighted components.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise highlighting in, or a CSS selector for the root element.
	 * @param {Object} [options={}] - An options object for configuring the higlighter.
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
			return new Highlight(rootElement, options);
		}

		// If the rootElement wasn't itself a filter form, then find ALL of the child things that have the data-o-component=o-highlight set
		 return Array.from(rootElement.querySelectorAll('[data-o-component="o-highlight"]'), rootElement => new Highlight(rootElement, options));
	}

}
