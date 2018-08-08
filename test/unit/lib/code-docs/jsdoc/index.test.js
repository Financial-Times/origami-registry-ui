'use strict';

const assert = require('proclaim');
const sinon = require('sinon');
const JsDoc = require('../../../../../lib/code-docs/jsdoc');
const ClassNode = require('../../../../../lib/code-docs/jsdoc/nodes/class');
const FunctionNode = require('../../../../../lib/code-docs/jsdoc/nodes/function');
const PropertyNode = require('../../../../../lib/code-docs/jsdoc/nodes/property');
const EventNode = require('../../../../../lib/code-docs/jsdoc/nodes/event');
const NamespaceNode = require('../../../../../lib/code-docs/jsdoc/nodes/namespace');
const MixinNode = require('../../../../../lib/code-docs/jsdoc/nodes/mixin');
const ModuleNode = require('../../../../../lib/code-docs/jsdoc/nodes/module');
const ClassDoclet = require('../../../mock/code-docs/jsdoc/class');
const FunctionDoclet = require('../../../mock/code-docs/jsdoc/function');
const EventDoclet = require('../../../mock/code-docs/jsdoc/event');
const PropertyDoclet = require('../../../mock/code-docs/jsdoc/property');
const NamespaceDoclet = require('../../../mock/code-docs/jsdoc/namespace');
const MixinDoclet = require('../../../mock/code-docs/jsdoc/mixin');
const ModuleDoclet = require('../../../mock/code-docs/jsdoc/module');

describe('lib/code-docs/jsdoc/index', () => {

    describe('supportedDoclets', () => {
        it('Returns an array of supported doclet kinds', () => {
            assert.isTrue(Array.isArray(JsDoc.supportedDoclets()), 'Did not return an array.');
            assert.isTrue(JsDoc.supportedDoclets().includes('class'), 'Expected at least class doclets to be supported.');
        });
    });

    describe('formatDoclet', () => {
        it('Formats a class doclet', () => {
            const doclet = ClassDoclet.classDeclarationDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof ClassNode, 'Did not create a class node from a class doclet.');
        });
        it('Formats a function doclet', () => {
            const doclet = FunctionDoclet.globalFunctionDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof FunctionNode, 'Did not create a function node from a function doclet.');
        });
        it('Formats a member doclet', () => {
            const doclet = PropertyDoclet.memberDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof PropertyNode, 'Did not create a property node from a member doclet.');
        });
        it('Formats a constant doclet', () => {
            const doclet = PropertyDoclet.constantDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof PropertyNode, 'Did not create a property node from a constant doclet.');
        });
        it('Formats an event doclet', () => {
            const doclet = EventDoclet.eventDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof EventNode, 'Did not create a event node from a event doclet.');
        });
        it('Formats a namespace doclet', () => {
            const doclet = NamespaceDoclet.namespaceDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof NamespaceNode, 'Did not create a namespace node from a namespace doclet.');
        });
        it('Formats a mixin doclet', () => {
            const doclet = MixinDoclet.mixinDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof MixinNode, 'Did not create a mixin node from a mixin doclet.');
        });
        it('Formats a module doclet', () => {
            const doclet = ModuleDoclet.moduleDoclet;
            const node = JsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof ModuleNode, 'Did not create a module node from a module doclet.');
        });
        it('Throws an error for an unsupported doclet kind', () => {
            const doclet = {
                kind: 'somethingunknown'
            };
            const formatDoclet = JsDoc.formatDoclet.bind(null, doclet);
            assert.throws(formatDoclet, null, 'Should throw an error for an unsupported doclet kind.');
        });
    });

});
