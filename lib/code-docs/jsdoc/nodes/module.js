'use strict';

module.exports = function createModuleNode(doclet) {
    const node = {};

    // Add basic module node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'modules',
        'label': 'Module',
        'description': doclet.description || '',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual)
    });

    // Add returns value to the module node, in case the module is a single export function.
    if (doclet.returns) {
        node.returns = {
            'type': doclet.returns[0] && doclet.returns[0].type && doclet.returns[0].type.names ? doclet.returns[0].type.names : [], // return can be of multiple types
            'description': doclet.returns[0] && doclet.returns[0].description || ''
        };
    }

    // Add examples to module node.
    if (Array.isArray(doclet.examples)) {
        doclet.examples.forEach(example => node.examples.push(example));
    }

    // Add paramters to module node, in case the module is a single export function.
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