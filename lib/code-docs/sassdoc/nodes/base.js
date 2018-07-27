'use strict';

const Example = require('../../example');

class BaseNode {
    constructor(doclet) {
        const docletContext = doclet.context || {};
        const docletLinks = doclet.link || [];
        const hasGroup = typeof (doclet.groupName) === 'object' && Object.entries(doclet.groupName);
        this.name = docletContext.name || '';
        this.description = docletContext.description || '';
        this.type = docletContext.type || '';
        this.group = hasGroup && doclet.groupName[0] ? doclet.groupName[0] : '';
        this.groupLabel = hasGroup && doclet.groupName[1] ? doclet.groupName[1] : '';
        this.longname = [this.group, docletContext.type, docletContext.name].filter(part => part).join('-');
        this.links = docletLinks.filter(link => link.url).map((link) => {
            return {
                url: link.url,
                caption: link.caption || ''
            };
        });
    }

    addExamples(doclet) {
        if (Array.isArray(doclet.example)) {
            this.examples = this.examples || [];
            doclet.example.forEach(example => {
                if (typeof example.code === 'string' && example.code.length > 1) {
                    this.examples.push(new Example(example.code, example.type, example.description));
                }
            });
        }
    }
}

module.exports = BaseNode;

