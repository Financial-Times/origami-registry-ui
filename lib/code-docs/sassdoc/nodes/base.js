'use strict';

const Example = require('../../example');

class BaseNode {
    constructor(doclet) {
        const groupKey = Array.isArray(doclet.group) ? doclet.group[0] : undefined;
        const docletContext = doclet.context || {};
        this.name = docletContext.name || '';
        this.description = doclet.description || '';
        this.longname = [groupKey, docletContext.type, docletContext.name].filter(part => part && part !== 'undefined').join('-');
        this.file = {
            path: doclet.file.path || '',
            name: doclet.file.name || '',
        };
        if (Array.isArray(doclet.group)) {
            this.group = {
                key: groupKey || '',
                name: doclet.groupName[groupKey] || groupKey || '',
            };
        }
        if (doclet.brand) {
            this.brand = {
                description: doclet.brand.description || '',
                supported: doclet.brand.supported || [],
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
        if (Array.isArray(doclet.links)) {
            doclet.links.filter(link => link.url).forEach((link) => {
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
                this.parameters.push({
                    name: parameter.name || `[param #${index}]`,
                    type: this.parseTypes(parameter.type),
                    description: parameter.description || '',
                    default: parameter.default || '',
                    optional: new Boolean(parameter.default)
                });
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

