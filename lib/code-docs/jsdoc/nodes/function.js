'use strict';

module.exports = function createFunctionNode(doclet) {
    const node = {};

    // Add basic function node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'functions',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual),
        'description': doclet.description || '',
        'parameters': [],
        'examples': []
    });

    // Add returns value to function node.
    if (doclet.returns) {
        node.returns = {
            'type': doclet.returns[0].type && doclet.returns[0].type.names.length > 1 ? doclet.returns[0].type.names : [], // return could be multuple types
            'description': doclet.returns[0].description || ''
        };
    }

    // Add examples to function node.
    if (Array.isArray(doclet.examples)) {
        doclet.examples.forEach(example => node.examples.push(example));
    }

    // Add paramters to function node.
    if (Array.isArray(doclet.params)) {
        doclet.params.forEach((param) => node.parameters.push({
            'name': param.name,
            'type': param.type && param.type.names ? param.type.names : [], // param can accept multiple types
            'description': param.description || '',
            'default': param.hasOwnProperty('defaultvalue') ? param.defaultvalue : '',
            'optional': typeof param.optional === 'boolean' ? param.optional : '',
            'nullable': typeof param.nullable === 'boolean' ? param.nullable : ''
        }));
    }

    return node;
};