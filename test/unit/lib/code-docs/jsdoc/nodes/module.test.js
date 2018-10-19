'use strict';

const assert = require('proclaim');
const JsDocModuleNode = require('../../../../../../lib/code-docs/jsdoc/nodes/module');
const ModuleDoclet = require('../../../../mock/code-docs/jsdoc/module');

describe('lib/code-docs/jsdoc/nodes/module', () => {

    const moduleDoclet = ModuleDoclet.moduleDoclet;

    it('adds properties for a doclet which represents a module', () => {
        const doclet = moduleDoclet;
        const node = new JsDocModuleNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'modules', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Module', 'Did not add the "label" property as expected.');
        assert.equal(Array.isArray(node.examples), true, 'Did not attempt to add the "examples" property as expected.');
        assert.equal(Array.isArray(node.parameters), true, 'Did not attempt to add the "parameters" property as expected.');
        assert.equal(typeof node.returns, 'object', 'Did not attempt to add the "returns" property as expected.');
    });
});
