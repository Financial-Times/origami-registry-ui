module.exports = function createNamespaceNode(doclet) {
    const node = {};

    // Add namespace node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'namespaces',
        'description': doclet.description || '',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual)
    });

    return node;
}
