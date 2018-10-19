'use strict';

const assert = require('proclaim');
const JsDocNamespaceNode = require('../../../../../../lib/code-docs/jsdoc/nodes/namespace');
const NamespaceDoclet = require('../../../../mock/code-docs/jsdoc/namespace');

describe('lib/code-docs/jsdoc/nodes/namespace', () => {
    const namespaceDoclet = NamespaceDoclet.namespaceDoclet;

    it('adds properties for a doclet which represents a namespace', () => {
        const doclet = namespaceDoclet;
        const node = new JsDocNamespaceNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'namespaces', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Namespace', 'Did not add the "label" property as expected.');
    });
});
