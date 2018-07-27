'use strict';

const Example = require('../../example');

class BaseNode {
    constructor(doclet) {
        this.name = doclet.name;
        this.longname = doclet.longname;
        this.kind = doclet.kind;
        this.memberof = doclet.memberof;
        this.description = doclet.description || '';
        this.access = doclet.access || '';
        this.virtual = Boolean(doclet.virtual);
    }

    addExamples(doclet, target = this) {
        if (Array.isArray(doclet.examples)) {
            target.examples = target.examples || [];

            doclet.examples.forEach((example) => {
                let caption;
                let code;

                /** @see https://github.com/jsdoc3/jsdoc/blob/832dfd704a01fc931ef54ef0a02896d89a5ee9ad/templates/default/publish.js#L470 */
                if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
                    caption = RegExp.$1;
                    code = RegExp.$3;
                }

                if (typeof code === 'string' && code.length > 1) {
                    target.examples.push(new Example(code, 'js', caption));
                }
            });
        }
    }
    
    addParameters(doclet, target = this) {
        if (Array.isArray(doclet.params)) {
            target.parameters = target.parameters || [];
            doclet.params.forEach((param) => target.parameters.push({
                'name': param.name,
                'type': param.type && param.type.names ? param.type.names : [], // param can accept multiple types
                'description': param.description || '',
                'default': param.hasOwnProperty('defaultvalue') ? param.defaultvalue : '',
                'optional': typeof param.optional === 'boolean' ? param.optional : '',
                'nullable': typeof param.nullable === 'boolean' ? param.nullable : ''
            }));
        }
    }
    
    addReturns(doclet, target = this) {
        if (doclet.returns) {
            target.parameters = target.parameters || [];
            target.returns = {
                'type': doclet.returns[0] && doclet.returns[0].type && doclet.returns[0].type.names ? doclet.returns[0].type.names : [], // return can be of multiple types
                'description': doclet.returns[0] && doclet.returns[0].description || ''
            };
        }
    }
}

module.exports = BaseNode;
