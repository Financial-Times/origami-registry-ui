'use strict';

const assert = require('proclaim');
const SassDocFunctionNode = require('../../../../../../lib/code-docs/sassdoc/nodes/function');
const FunctionDoclet = require('../../../../mock/code-docs/sassdoc/function');

describe('lib/code-docs/sassdoc/nodes/function', () => {
    const comprehensiveNode = new SassDocFunctionNode(FunctionDoclet.comprehensiveDoclet);
    const simpleNode = new SassDocFunctionNode(FunctionDoclet.simpleDoclet);
    it('creates a function node from a function doclet', () => {
        assert.isTrue(simpleNode instanceof SassDocFunctionNode);
        assert.isTrue(comprehensiveNode instanceof SassDocFunctionNode);
    });
    it('has a kind property', () => {
        assert.equal(simpleNode.kind, 'function');
        assert.equal(comprehensiveNode.kind, 'function');
    });
    it('has a return property if the function doclet defines one', () => {
        assert.deepEqual(comprehensiveNode.return.types, ['String', 'Null']);
        assert.equal(comprehensiveNode.return.description, 'A made-up sentence.');
    });
    it('has a blank return property if the function doclet defines no return value', () => {
        assert.equal(simpleNode.return.types, '');
        assert.equal(simpleNode.return.description, '');
    });
    it('has a blank aliases property if the function doclet defines no alias', () => {
        assert.deepEqual(comprehensiveNode.aliases, [
            'oTestComponentDoTell'
        ]);
    });
    it('has an aliases property if the function doclet has an alias', () => {
        assert.deepEqual(simpleNode.aliases, []);
    });
    it('has a parameters property if the function doclet defines parameters', () => {
        assert.deepEqual(comprehensiveNode.parameters, [
            {
                'type': ['Bool'],
                'name': 'keep-quiet',
                'default': 'false',
                'optional': true,
                'description': 'Whether to tell (default) or keep quiet.'
            },
            {
                'type': ['Bool'],
                'name': 'truth',
                'default': 'true',
                'optional': true,
                'description': 'Whether to tell the truth (default) or lie.'
            }
        ]);
    });
    it('has has blank parameters property if the function doclet has no parameters', () => {
        assert.deepEqual(simpleNode.parameters, []);
    });
});
