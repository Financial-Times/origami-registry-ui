'use strict';

const assert = require('proclaim');
const SassDocVariableNode = require('../../../../../../lib/code-docs/sassdoc/nodes/variable');
const VariableDoclet = require('../../../../mock/code-docs/sassdoc/variable');

describe('lib/code-docs/sassdoc/nodes/variable', () => {
    const comprehensiveNode = new SassDocVariableNode(VariableDoclet.comprehensiveDoclet);
    const simpleNode = new SassDocVariableNode(VariableDoclet.simpleDoclet);
    it('creates a variable node from a variable doclet', () => {
        assert.isTrue(simpleNode instanceof SassDocVariableNode);
        assert.isTrue(comprehensiveNode instanceof SassDocVariableNode);
    });
    it('has a kind property', () => {
        assert.equal(simpleNode.kind, 'variable');
        assert.equal(comprehensiveNode.kind, 'variable');
    });
    it('adds types property if the variable doclet defines its type', () => {
        assert.deepEqual(comprehensiveNode.types, ['Color']);
    });
    it('has a blank types property if the variable doclet defines no type', () => {
        assert.deepEqual(simpleNode.types, []);
    });
    it('has a blank aliases property if the variable doclet defines no alias', () => {
        assert.deepEqual(comprehensiveNode.aliases, [
            'o-test-component-primary-color'
        ]);
    });
    it('has an aliases property if the variable doclet has an alias', () => {
        assert.deepEqual(simpleNode.aliases, []);
    });
});
