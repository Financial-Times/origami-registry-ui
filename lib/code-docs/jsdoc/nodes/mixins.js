module.exports = function createMixinNode(doclet) {
    const node = {};

    // Add mixin node details.
    Object.assign(node, {
        'name': doclet.name,
        'longname': doclet.longname,
        'kind': doclet.kind,
        'memberof': doclet.memberof,
        'group': 'mixins',
        'description': doclet.description || '',
        'access': doclet.access || '',
        'virtual': Boolean(doclet.virtual)
    });

    return node;
}
