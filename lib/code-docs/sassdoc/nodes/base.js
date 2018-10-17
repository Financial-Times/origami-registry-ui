'use strict';

const Example = require('../../example');

class BaseNode {
    constructor(doclet) {
        const groupKey = Array.isArray(doclet.group) ? doclet.group[0] : undefined;
        const fileName = doclet.file && doclet.file.name ? doclet.file.name : '';
        const filePath = doclet.file && doclet.file.path ? doclet.file.path : '';
        const docletContext = doclet.context || {};
        this.name = docletContext.name || '';
        this.description = doclet.description || '';
        this.longname = [groupKey, docletContext.type, docletContext.name].filter(part => part && part !== 'undefined').join('-');
        this.file = {
            path: filePath.replace(new RegExp(`${fileName}$`), ''),
            name: fileName
        };
        if (doclet.context && doclet.context.line && doclet.context.line.start) {
            this.file.lineno = doclet.context.line.start;
        }
        if (Array.isArray(doclet.group)) {
            const groupName = doclet.groupName && doclet.groupName[groupKey] ? doclet.groupName[groupKey] : '';
            this.group = {};
            this.group.key = groupKey || '';
            this.group.name = groupName || this.group.key;
        }
        if (doclet.brand && Array.isArray(doclet.brand.supported) && doclet.brand.supported.length > 0) {
            this.brand = {
                description: doclet.brand.description || '',
                supported: doclet.brand.supported,
            };
        }
        if (doclet.deprecated) {
            this.deprecated = doclet.deprecated;
        }
        this.addLinks(doclet);
        this.addExamples(doclet);
    }

    addAliases(doclet) {
        this.aliases = this.aliases || [];
        if (Array.isArray(doclet.aliased)) {
            this.aliases = doclet.aliased;
        }
    }

    addLinks(doclet) {
        this.links = this.links || [];
        if (Array.isArray(doclet.link)) {
            doclet.link.filter(link => link.url).forEach((link) => {
                this.links.push({
                    url: link.url,
                    caption: link.caption || ''
                });
            });
        }
    }

    addParameters(doclet) {
        this.parameters = this.parameters || [];
        if (Array.isArray(doclet.parameter)) {
            doclet.parameter.forEach((parameter, index) => {
                const nodeParameter = {
                    name: parameter.name || `[param #${index + 1}]`,
                    type: this.parseTypes(parameter.type),
                    description: parameter.description || '',
                    optional: Boolean(parameter.default)
                };
                if (parameter.default) {
                    nodeParameter.default = parameter.default;
                }
                this.parameters.push(nodeParameter);
            });
        }
    }

    addExamples(doclet) {
        this.examples = this.examples || [];
        if (Array.isArray(doclet.example)) {
            doclet.example.forEach(example => {
                if (typeof example.code === 'string' && example.code.length > 1) {
                    this.examples.push(new Example(example.code, example.type, example.description));
                }
            });
        }
    }

    parseTypes(typeString) {
        return typeString ? typeString.split('|').map((type => type.trim())) : [];
    }
}

module.exports = BaseNode;

