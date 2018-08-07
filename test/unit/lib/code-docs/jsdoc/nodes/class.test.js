'use strict';

const assert = require('proclaim');
const JsDocClassNode = require('../../../../../../lib/code-docs/jsdoc/nodes/class');
const Example = require('../../../../../../lib/code-docs/example');

describe('lib/code-docs/jsdoc/nodes/class', () => {
    const constructorDoclet = {
        'comment': '/**\n * An example constructor within a module.\n * @constructor\n * @example\n * const myIncrementer = new incrementer();\n * myIncrementer.increment(4); // 4\n * myIncrementer.increment(4); // 8\n * myIncrementer.increment(1); // 9\n */',
        'meta': {
            'range': [
                698,
                996
            ],
            'filename': 'complex-module.js',
            'lineno': 28,
            'columnno': 0,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000215',
                'name': 'module.exports.incrementer',
                'type': 'FunctionExpression',
                'value': 'incrementer',
                'paramnames': []
            },
            'vars': {
                'this.num': 'module:ComplexModule.incrementer#num',
                'this.increment': 'module:ComplexModule.incrementer#increment',
                '': null
            }
        },
        'description': 'An example constructor within a module.',
        'kind': 'class',
        'examples': [
            'const myIncrementer = new incrementer();\nmyIncrementer.increment(4); // 4'
        ],
        'name': 'incrementer',
        'longname': 'module:ComplexModule.incrementer',
        'memberof': 'module:ComplexModule',
        'scope': 'static'
    };

    const classDeclarationDoclet = {
        'comment': '/**\n * Class representing a domesticated animal.\n */',
        'meta': {
            'range': [
                370,
                509
            ],
            'filename': 'class.js',
            'lineno': 22,
            'columnno': 0,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000095',
                'name': 'Pet',
                'type': 'ClassDeclaration',
                'paramnames': []
            }
        },
        'classdesc': 'Class representing a domesticated animal.',
        'name': 'Pet',
        'longname': 'Pet',
        'kind': 'class',
        'scope': 'global',
        'params': []
    };

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
