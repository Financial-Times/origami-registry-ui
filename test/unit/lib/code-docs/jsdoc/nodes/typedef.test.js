'use strict';

const assert = require('proclaim');
const JsDocTypedefNode = require('../../../../../../lib/code-docs/jsdoc/nodes/typedef');
const TypedefDoclet = require('../../../../mock/code-docs/jsdoc/typedef');

describe('lib/code-docs/jsdoc/nodes/mixin', () => {

    const objectTypedefDoclet = TypedefDoclet.typeDefinition;
    const functionTypedefDoclet = TypedefDoclet.functionTypeDefinition;

    it('adds properties for a doclet which represents a typedef', () => {
        const doclet = objectTypedefDoclet;
        const node = new JsDocTypedefNode(doclet);
        assert.deepEqual(node.properties, [{
            name: 'sortable',
            type: ['Bool'],
            description: '[true] - Toggle the component\'s sort feature.'
        },
        {
            name: 'expanded',
            type: ['Undefined', 'Bool'],
            description: '[Undefined] - Toggle the component expand feature.'
        }], 'Did not add the "properties" property as expected.');
    });

    it('adds examples for a doclet which represents a typedef', () => {
        const doclet = functionTypedefDoclet;
        const node = new JsDocTypedefNode(doclet);
        assert.deepEqual(node.examples, [], 'Did not add the "examples" property as expected.');
    });

    it('adds parameters for a doclet which represents a typedef', () => {
        const doclet = functionTypedefDoclet;
        const node = new JsDocTypedefNode(doclet);
        assert.deepEqual(node.parameters, [
            {
                'default': '',
                'description': '',
                'name': 'cell',
                'nullable': '',
                'optional': '',
                'types': [ {'name': 'HTMLElement'}]
            }
        ], 'Did not add the "parameters" property as expected.');
    });

    it('adds returns for a doclet which represents a typedef', () => {
        const doclet = functionTypedefDoclet;
        const node = new JsDocTypedefNode(doclet);
        assert.deepEqual(node.returns, { type: ['String', 'Object'], description: '' }, 'Did not add the "returns" property as expected.');
    });
});
