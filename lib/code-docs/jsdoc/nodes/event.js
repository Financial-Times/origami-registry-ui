'use strict';

module.exports = function createEventNode(doclet) {
    const node = {};

    // Add basic event node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'events',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual),
        'description': doclet.description || '',
        'parameters': [],
        'examples': []
    });

    // Add returns value to event node.
    if (doclet.returns) {
        node.returns = {
            'type': doclet.returns.type && doclet.returns.type.names ? doclet.returns.type.names : [], // return can be of multiple types
            'description': doclet.returns.description || ''
        };
    }

    // Add examples to event node.
    if (Array.isArray(doclet.examples)) {
        doclet.examples.forEach(example => node.examples.push(example));
    }

    // Add paramters to event node.
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