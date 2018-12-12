'use strict';

const assert = require('proclaim');
const JsDocPropertyNode = require('../../../../../../lib/code-docs/jsdoc/nodes/property');
const PropertyDoclet = require('../../../../mock/code-docs/jsdoc/property');

describe('lib/code-docs/jsdoc/nodes/namespace', () => {
    const propertyDoclet = PropertyDoclet.memberDoclet;

    it('adds properties for a doclet which represents a property with a defined type', () => {
        const doclet = propertyDoclet;
        const node = new JsDocPropertyNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'properties', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Property', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.types, ['string'], 'Did not add the "type" property as expected.');
    });

    it('adds properties for a doclet which represents a property with unknown type', () => {
        const doclet = propertyDoclet;
        doclet.type = {};
        const node = new JsDocPropertyNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'properties', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Property', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.types, [], 'Did not add the "type" property as expected.');
    });
});
