'use strict';

const assert = require('proclaim');
const SassDoc = require('../../../../../lib/code-docs/sassdoc');
const VariableNode = require('../../../../../lib/code-docs/sassdoc/nodes/variable');
const MixinNode = require('../../../../../lib/code-docs/sassdoc/nodes/mixin');
const FunctionNode = require('../../../../../lib/code-docs/sassdoc/nodes/function');
const MixinDoclet = require('../../../mock/code-docs/sassdoc/mixin');
const FunctionDoclet = require('../../../mock/code-docs/sassdoc/function');
const VariableDoclet = require('../../../mock/code-docs/sassdoc/variable');

describe('lib/code-docs/sassdoc/index', () => {

    it('has a groupNameAliases property which maps a group name of "undefined" to the component name', () => {
        const testSassDoc = new SassDoc('o-test-component', 'master', []);
        assert.deepEqual(testSassDoc.groupNameAliases, {
            'undefined': 'o-test-component',
        });
    });

    describe('supportedDocletKinds', () => {
        it('returns an array of supported doclet kinds', () => {
            assert.isTrue(Array.isArray(SassDoc.supportedDocletKinds()), 'Did not return an array.');
            assert.isTrue(SassDoc.supportedDocletKinds().includes('mixin'), 'Expected at least mixin doclets to be supported.');
        });
    });

    describe('getNodesByKind', () => {
        const testSassDoc = new SassDoc('o-test-component', 'master', [
            MixinDoclet.simpleDoclet,
            MixinDoclet.comprehensiveDoclet,
            FunctionDoclet.simpleDoclet,
            FunctionDoclet.comprehensiveDoclet,
            VariableDoclet.simpleDoclet,
            VariableDoclet.comprehensiveDoclet
        ]);
        const nodes = testSassDoc.getNodesByKind();
        assert.isTrue(nodes.mixin[0] instanceof MixinNode, 'Did not return an object with a mixins property containing the formatted mixin node.');
        assert.isTrue(nodes.function[0] instanceof FunctionNode, 'Did not return an object with a functions property containing the formatted function node.');
        assert.isTrue(nodes.variable[0] instanceof VariableNode, 'Did not return an object with a variables property containing the formatted variable node.');
    });

    describe('formatDoclet', () => {
        it('formats a function doclet', () => {
            const doclet = FunctionDoclet.comprehensiveDoclet;
            const node = SassDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof FunctionNode, 'Did not create a function node from a function doclet.');
        });
        it('formats a mixin doclet', () => {
            const doclet = MixinDoclet.comprehensiveDoclet;
            const node = SassDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof MixinNode, 'Did not create a mixin node from a mixin doclet.');
        });
        it('formats a variable doclet', () => {
            const doclet = VariableDoclet.comprehensiveDoclet;
            const node = SassDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof VariableNode, 'Did not create a variable node from a variable doclet.');
        });
        it('throws an error for a placheolder doclet', () => {
            const doclet = {
                kind: 'placeholder'
            };
            const formatDoclet = SassDoc.formatDoclet.bind(null, doclet);
            assert.throws(formatDoclet, null, 'Should throw an error for an placeholder doclet kind.');
        });
        it('throws an error for an unsupported doclet', () => {
            const doclet = {
                kind: 'somethingunknown'
            };
            const formatDoclet = SassDoc.formatDoclet.bind(null, doclet);
            assert.throws(formatDoclet, null, 'Should throw an error for an unsupported doclet kind.');
        });
    });

    describe('getNodes', () => {
        const componentName = 'o-example';
        const brand = 'master';
        let doclet = {};

        beforeEach(() => {
            doclet = {
                'description': '',
                'context': {
                    'type': 'function',
                    'name': 'oTestComponentDouble',
                },
                'group': [
                    'undefined'
                ],
                'access': 'public'
            };
        });

        it('removes doclets which do not have an access property', () => {
            delete doclet.access;
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes doclets which do not have a public access property', () => {
            doclet.access = 'private';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes doclets which are implicity private (name with underscore), ignoring the access property', () => {
            doclet.context.name = '_oTestComponentDouble';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes doclets which do not belong to the current brand', () => {
            doclet.brand = {
                'supported': [
                    'internal'
                ],
                'description': ''
            };
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('does not remove doclets which define a brand property with no supported brands defined', () => {
            doclet.brand = {
                'supported': [
                ],
                'description': ''
            };
            assert.equal(new SassDoc(componentName, brand, [doclet]).getNodes().length, 1);
        });
        it('removes placeholder doclets', () => {
            doclet.context.type = 'placeholder';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes unsupported doclets', () => {
            doclet.context.type = 'notsupportedmadeup';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('does not remove supported, public doclets which are for the current brand', () => {
            assert.ok(new SassDoc(componentName, brand, [doclet]).getNodes()[0]);
        });
        it('uses the component name instead of an "undefined" doclet group', () => {
            assert.equal(new SassDoc(componentName, brand, [doclet]).getNodes()[0].group.name, componentName);
        });
        it('returns array with formatted doclets', () => {
            const nodes = new SassDoc(componentName, brand, [doclet]).getNodes();
            assert.isTrue(Array.isArray(nodes));
            assert.isTrue(nodes[0] instanceof FunctionNode);
        });
    });
});
