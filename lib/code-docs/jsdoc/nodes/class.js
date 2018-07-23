module.exports = function createClassNode(doclet) {
    const node = {};

    // Add basic class node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'classes',
        'description': doclet.classdesc || '',
        'extends': doclet.augments || [],
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual),
        'fires': doclet.fires || '',
        'constructor': {
            'name': doclet.name,
            'description': doclet.description || '',
            'parameters': [
            ],
            'examples': []
        }
    });

    // Add examples to class node  (on its constructor property).
    if (Array.isArray(doclet.examples)) {
        doclet.examples.forEach(example => node.constructor.examples.push(example));
    }

    // Add params to class node (on its constructor property).
    if (Array.isArray(doclet.params)) {
        doclet.params.forEach((param) => node.constructor.parameters.push({
            'name': param.name,
            'type': param.type && param.type.names ? param.type.names : [], // param can accept multiple types
            'description': param.description || '',
            'default': param.hasOwnProperty('defaultvalue') ? param.defaultvalue : '',
            'optional': typeof param.optional === 'boolean' ? param.optional : '',
            'nullable': typeof param.nullable === 'boolean' ? param.nullable : ''
        }));
    }

    return node;
}
