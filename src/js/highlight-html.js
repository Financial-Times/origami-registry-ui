'use strict';

const hljs = require('highlight.js');


/**
 * Represents a highlighted syntax element.
 */

class Highlight {
	/** Class constructor.
	 * @param {Object} [options={}] - Options for highlighting configuration.
	 */

	constructor(options) {
		this.highlightElement = options && options.element ? options.element : 'pre code';
		this.opts = Object.assign({}, {
			languages: options && options.languages ? [].concat(options.languages) : ['javascript', 'js', 'xml', 'html', 'handlebars']
		}, options);

		hljs.configure({
			languages: this.opts.languages
		});

		this.highlightElements();
		hljs.initHighlighting();
	}

	highlightElements () {
		const elements = Array.from(document.querySelectorAll(this.highlightElement));

		if (elements) {
			elements.forEach(element => {
				hljs.highlightBlock(element);
			});
		}
	}

	static init (options) {
		return new Highlight(options);
	}
}

// Exports
module.exports = Highlight;
