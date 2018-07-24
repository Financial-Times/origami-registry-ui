'use strict';

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
            doclet.examples.forEach(example => target.examples.push(example));
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