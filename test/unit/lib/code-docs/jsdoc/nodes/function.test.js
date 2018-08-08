'use strict';

const assert = require('proclaim');
const JsDocFunctionNode = require('../../../../../../lib/code-docs/jsdoc/nodes/function');
const FunctionDoclet = require('../../../../mock/code-docs/jsdoc/function');

describe('lib/code-docs/jsdoc/nodes/function', () => {

    const globalFunctionDoclet = FunctionDoclet.globalFunctionDoclet;
    const instanceFunctionDocletWhichFires = FunctionDoclet.instanceFunctionDocletWhichFires;

    it('adds properties for a doclet which represents a global function and does not fire an event', () => {
        const doclet = globalFunctionDoclet;
        const node = new JsDocFunctionNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'functions', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Function', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.scope, doclet.scope, 'Did not add the "scope" property as expected.');
        assert.deepEqual(node.fires, [], 'Did not add the "fires" property as expected.');
        assert.equal(Array.isArray(node.examples), true, 'Did not attempt to add the "examples" property as expected.');
        assert.equal(Array.isArray(node.parameters), true, 'Did not attempt to add the "parameters" property as expected.');
    });

    it('adds properties for a doclet which represents an instance function and fires an event', () => {
        const doclet = instanceFunctionDocletWhichFires;
        const node = new JsDocFunctionNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'functions', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Method', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.scope, doclet.scope, 'Did not add the "scope" property as expected.');
        assert.deepEqual(node.fires, doclet.fires, 'Did not add the "fires" property as expected.');
        assert.equal(Array.isArray(node.examples), true, 'Did not attempt to add the "examples" property as expected.');
        assert.equal(Array.isArray(node.parameters), true, 'Did not attempt to add the "parameters" property as expected.');
    });
});
