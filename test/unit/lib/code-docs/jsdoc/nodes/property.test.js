'use strict';

const assert = require('proclaim');
const JsDocPropertyNode = require('../../../../../../lib/code-docs/jsdoc/nodes/property');

describe('lib/code-docs/jsdoc/nodes/namespace', () => {
    const propertyDoclet = {
        'comment': '/** @member {string} */',
        'meta': {
            'range': [
                162,
                178
            ],
            'filename': 'class.js',
            'lineno': 9,
            'columnno': 1,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000070',
                'name': 'this.name',
                'type': 'Identifier',
                'value': 'name',
                'paramnames': []
            }
        },
        'kind': 'member',
        'type': {
            'names': [
                'string'
            ]
        },
        'name': 'name',
        'longname': 'Person#name',
        'memberof': 'Person',
        'scope': 'instance'
    };

    it('adds properties for a doclet which represents a property with a defined type', () => {
        const doclet = propertyDoclet;
        const node = new JsDocPropertyNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'properties', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Property', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.type, ['string'], 'Did not add the "type" property as expected.');
    });

    it('adds properties for a doclet which represents a property with unknown type', () => {
        const doclet = propertyDoclet;
        doclet.type = {};
        const node = new JsDocPropertyNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'properties', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Property', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.type, [], 'Did not add the "type" property as expected.');
    });
});
