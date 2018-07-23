'use strict';

module.exports = function createPropertyNode(doclet) {
    const node = {};

    // Add member node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind, // Include kind as a property could be a "member" or "constant"
        'memberof': doclet.memberof,
        'group': 'properties',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual),
        'description': doclet.description || '',
        'type': doclet.type && doclet.type.length !== 0 ? doclet.type : [], // multiple types
    });

    return node;
};