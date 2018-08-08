'use strict';

const assert = require('proclaim');
const JsDocMixinNode = require('../../../../../../lib/code-docs/jsdoc/nodes/mixin');
const MixinDoclet = require('../../../../mock/code-docs/jsdoc/mixin');

describe('lib/code-docs/jsdoc/nodes/mixin', () => {

    const mixinDoclet = MixinDoclet.mixinDoclet;

    it('adds properties for a doclet which represents a mixin', () => {
        const doclet = mixinDoclet;
        const node = new JsDocMixinNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'mixins', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Mixin', 'Did not add the "label" property as expected.');
    });
});
