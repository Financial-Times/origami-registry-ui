'use strict';

const assert = require('proclaim');
const JsDoc = require('../../../../../lib/code-docs/jsdoc');
const ClassNode = require('../../../../../lib/code-docs/jsdoc/nodes/class');
const EventNode = require('../../../../../lib/code-docs/jsdoc/nodes/event');
const FunctionNode = require('../../../../../lib/code-docs/jsdoc/nodes/function');
const MixinNode = require('../../../../../lib/code-docs/jsdoc/nodes/mixin');
const NamespaceNode = require('../../../../../lib/code-docs/jsdoc/nodes/namespace');
const PropertyNode = require('../../../../../lib/code-docs/jsdoc/nodes/property');
const ModuleNode = require('../../../../../lib/code-docs/jsdoc/nodes/module');
const jsDocExampleData = require('../../../../../test/jsdoc.json'); //@todo replace with real data

describe('lib/code-docs/jsdoc/index', () => {

    const testJsDoc = new JsDoc(jsDocExampleData);

    describe('getNodes', () => {
        const nodes = testJsDoc.getNodes();
        it('Did not return array.', () => {
            assert.isTrue(Array.isArray(nodes));
        });
        it('Returns the expected number of formatted class nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof ClassNode).length, 5);
        });
        it('Returns the expected number of formatted event nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof EventNode).length, 1);
        });
        it('Returns the expected number of formatted function nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof FunctionNode).length, 15);
        });
        it('Returns the expected number of formatted mixin nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof MixinNode).length, 1);
        });
        it('Returns the expected number of formatted namespace nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof NamespaceNode).length, 1);
        });
        it('Returns the expected number of property nodes from constant and member doclets.', () => {
            assert.equal(nodes.filter(node => node instanceof PropertyNode).length, 2);
        });
        it('Returns the expected number of formatted module nodes.', () => {
            assert.equal(nodes.filter(node => node instanceof ModuleNode).length, 2);
        });
    });

    describe('getNodesByTypeWithMembers', () => {
        const nodesByHierarchy = testJsDoc.getNodesByTypeWithMembers();
        it('Returns an object with the expected number of global classes', () => {
            assert.equal(nodesByHierarchy.classes.length, 4);
        });
        it('Returns an object with the expected number of global events', () => {
            assert.equal(nodesByHierarchy.events, undefined, 'No global events expected in this test');
        });
        it('Returns an object with the expected number of global functions', () => {
            assert.equal(nodesByHierarchy.functions.length, 5);
        });
        it('Returns an object with the expected number of global mixins', () => {
            assert.equal(nodesByHierarchy.mixins.length, 1);
        });
        it('Returns an object with the expected number of global namespaces', () => {
            assert.equal(nodesByHierarchy.namespaces.length, 1);
        });
        it('Returns an object with the expected number of global properties', () => {
            assert.equal(nodesByHierarchy.properties.length, 1);
        });
        it('Returns an object with the expected number of global modules', () => {
            assert.equal(nodesByHierarchy.modules.length, 2);
        });
        it('Nests non-global nodes', () => {
            assert.ok(nodesByHierarchy.classes.find(classNode => {
                return classNode.functions && classNode.functions[0] && classNode.functions[0] instanceof FunctionNode;
            }), 'Expected at least one class to have nested functions.');
            assert.ok(nodesByHierarchy.classes.find(classNode => {
                return classNode.properties && classNode.properties[0] && classNode.properties[0] instanceof PropertyNode;
            }), 'Expected at least one class to have nested properties.');
        });
    });

});
