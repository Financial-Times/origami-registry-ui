'use strict';

const assert = require('proclaim');
const JsDocMixinNode = require('../../../../../../lib/code-docs/jsdoc/nodes/mixin');

describe('lib/code-docs/jsdoc/class', () => {
    const mixinDoclet = {
        'comment': '/**\n *\n * Test the JSDoc mixin tag.\n * http://usejsdoc.org/tags-mixin.html\n *\n * This provides methods used for event handling. It\'s not meant to\n * be used directly.\n *\n * @mixin\n */',
        'meta': {
            'range': [
                190,
                782
            ],
            'filename': 'mixin.js',
            'lineno': 11,
            'columnno': 6,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000303',
                'name': 'Eventful',
                'type': 'ObjectExpression',
                'value': '{"on":"","fire":""}'
            }
        },
        'description': 'Test the JSDoc mixin tag.\nhttp://usejsdoc.org/tags-mixin.html\n\nThis provides methods used for event handling. It\'s not meant to\nbe used directly.',
        'kind': 'mixin',
        'name': 'Eventful',
        'longname': 'Eventful',
        'scope': 'global',
        'params': []
    };

    it('adds properties for a doclet which represents a mixin', () => {
        const doclet = mixinDoclet;
        const node = new JsDocMixinNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'mixins', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Mixin', 'Did not add the "label" property as expected.');
    });
});
