'use strict';

const Example = require('../../example');
const { URL } = require('url');

class BaseNode {
    constructor(doclet) {
        this.name = doclet.name;
        this.longname = doclet.longname;
        this.kind = doclet.kind;
        this.memberof = doclet.memberof;
        this.description = this.replaceLinks(doclet.description) || '';
        this.access = doclet.access || '';
        this.virtual = Boolean(doclet.virtual);
        this.file = {
            path: doclet.meta && doclet.meta.path ? doclet.meta.path : '',
            name: doclet.meta && doclet.meta.filename ? doclet.meta.filename : ''
        };

        if (doclet.meta && isNaN(doclet.meta.lineno) === false) {
            this.file.lineno = doclet.meta.lineno;
        }
        if (doclet.meta && isNaN(doclet.meta.columnno) === false) {
            this.file.columnno = doclet.meta.columnno;
        }
        if (doclet.deprecated) {
            this.deprecated = this.replaceLinks(doclet.deprecated);
        }
    }

    replaceLinks(jsDocComment) {
        if (typeof jsDocComment !== 'string') {
            return jsDocComment;
        }
        return jsDocComment.replace(/(?:\[(.*)\])?{@link ([^\s|}]*)\s?(?:[|])?([^}]*)}/g, (match, p1, p2, p3) => {
            //{@link namepathOrURL}
            let href = p2;
            let text = null;
            //[link text]{@link namepathOrURL}
            text = text || p1;
            //{@link namepathOrURL|text}
            //{@link namepathOrURL text (after the first space)}
            text = text || p3;
            // If no text show url/namepath.
            text = text || href;
            // If unable to construct url assume a JSDoc namepath and turn into a hash.
            try {
                new URL(href);
            } catch (error) {
                href = `#${href}`;
            }
            return `[${text}](${href})`;
        });
    }

    addExamples(doclet, target = this) {
        target.examples = target.examples || [];
        if (Array.isArray(doclet.examples)) {
            doclet.examples.forEach((example) => {
                let code = example;
                let caption;

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
        target.parameters = target.parameters || [];
        if (Array.isArray(doclet.params)) {
            doclet.params.forEach((param) => target.parameters.push({
                'name': param.name,
                'types': param.types || (param.type.names ? param.type.names.map((name) => {
                    return { name };
                }) : null) || [], // `param.types` is an Origami addition to a standard JSDoc doclet made by the registry, `param.type.names` forms a starndard JSDoc doclet.
                'description': param.description || '',
                'default': param.hasOwnProperty('defaultvalue') ? param.defaultvalue : '',
                'optional': typeof param.optional === 'boolean' ? param.optional : '',
                'nullable': typeof param.nullable === 'boolean' ? param.nullable : ''
            }));
        }
    }

    addReturns(doclet, target = this) {
        if (doclet.returns) {
            target.returns = {
                'type': doclet.returns[0] && doclet.returns[0].type && doclet.returns[0].type.names ? doclet.returns[0].type.names : [], // return can be of multiple types
                'description': doclet.returns[0] && doclet.returns[0].description || ''
            };
        }
    }
}

module.exports = BaseNode;
