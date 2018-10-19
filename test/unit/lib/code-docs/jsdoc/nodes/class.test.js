'use strict';

const assert = require('proclaim');
const JsDocClassNode = require('../../../../../../lib/code-docs/jsdoc/nodes/class');
const Example = require('../../../../../../lib/code-docs/example');
const ClassDoclet = require('../../../../mock/code-docs/jsdoc/class');

describe('lib/code-docs/jsdoc/nodes/class', () => {

    const constructorDoclet = ClassDoclet.constructorDoclet;
    const classDeclarationDoclet = ClassDoclet.classDeclarationDoclet;

    it('adds properties for a doclet which represents a constructor function', () => {
        const node = new JsDocClassNode(constructorDoclet);
        assert.equal(node.longname, constructorDoclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'classes', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Constructor Function', 'Did not add the "label" property as expected.');
        assert.equal(node.description, '', 'Did not add the "description" property as expected.');
        assert.deepEqual(node.extends, [], 'Did not add an emptry array for the "extends" property.');
        assert.deepEqual(node.fires, [], 'Did not add an emptry array for the "fires" property as the test doclet fires no events.');
        assert.deepEqual(node.constructor, {
            'name': constructorDoclet.name,
            'description': constructorDoclet.description,
            'parameters': [],
            'examples': [new Example(constructorDoclet.examples[0], 'js')]
        }, 'Did not create a constructor property from the constructor function as expected.');
    });

    it('adds properties for a doclet which represents a class declaration', () => {
        const node = new JsDocClassNode(classDeclarationDoclet);
        assert.equal(node.longname, classDeclarationDoclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'classes', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Class', 'Did not add the "label" property as expected.');
        assert.equal(node.description, classDeclarationDoclet.classdesc, 'Did not add the "description" property as expected.');
        assert.deepEqual(node.extends, [], 'Did not add an emptry array for the "extends" property.');
        assert.deepEqual(node.fires, [], 'Did not add an emptry array for the "fires" property as the test doclet fires no events.');
        assert.deepEqual(node.constructor, {
            'name': classDeclarationDoclet.name,
            'description': '',
            'parameters': [],
            'examples': []
        }, 'Did not create a constructor property from the class declaration as expected.');
    });
});
