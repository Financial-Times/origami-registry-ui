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
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'typedefs', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Typedef', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.types, ['Object'], 'Did not add the "type" property as expected.');
        assert.deepEqual(node.examples, [], 'Did not add the "examples" property as expected.');
        assert.deepEqual(node.properties, [{
            name: 'sortable',
            types: ['Bool'],
            description: '[true] - Toggle the component\'s sort feature.'
        },
        {
            name: 'expanded',
            types: ['Undefined', 'Bool'],
            description: '[Undefined] - Toggle the component expand feature.'
        }], 'Did not add the "properties" property as expected.');
    });

    it('adds parameters for a typedef doclet which represents a function', () => {
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

    it('adds returns for a typedef doclet which represents a function with return values', () => {
        const doclet = functionTypedefDoclet;
        const node = new JsDocTypedefNode(doclet);
        assert.deepEqual(node.returns, { types: ['String', 'Object'], description: '' }, 'Did not add the "returns" property as expected.');
    });
});
