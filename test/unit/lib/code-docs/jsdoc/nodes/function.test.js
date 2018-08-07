'use strict';

const assert = require('proclaim');
const JsDocFunctionNode = require('../../../../../../lib/code-docs/jsdoc/nodes/function');

describe('lib/code-docs/jsdoc/class', () => {
    const globalFunctionDoclet = {
        'comment': '/**\n * @deprecated Use {@link Person#sayHello} instead.\n * @param {string} name\n * To make a human says hello, announcing their name.\n */',
        'meta': {
            'range': [
                138,
                213
            ],
            'filename': 'deprecated.js',
            'lineno': 6,
            'columnno': 0,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000250',
                'name': 'humanSayHello',
                'type': 'FunctionDeclaration',
                'paramnames': [
                    'name'
                ]
            }
        },
        'deprecated': 'Use {@link Person#sayHello} instead.',
        'params': [
            {
                'type': {
                    'names': [
                        'string'
                    ]
                },
                'description': 'To make a human says hello, announcing their name.',
                'name': 'name'
            }
        ],
        'name': 'humanSayHello',
        'longname': 'humanSayHello',
        'kind': 'function',
        'scope': 'global'
    };

    const instanceFunctionDocletWhichFires = {
        'comment': '/**\n * Throw a snowball.\n *\n * @fires Hurl#snowball\n */',
        'meta': {
            'range': [
                164,
                484
            ],
            'filename': 'event.js',
            'lineno': 14,
            'columnno': 0,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000269',
                'name': 'Hurl.prototype.snowball',
                'type': 'FunctionExpression',
                'paramnames': []
            }
        },
        'description': 'Throw a snowball.',
        'fires': [
            'Hurl#event:snowball'
        ],
        'name': 'snowball',
        'longname': 'Hurl#snowball',
        'kind': 'function',
        'memberof': 'Hurl',
        'scope': 'instance'
    };

    it('adds properties for a doclet which represents an global function and does not fire an event', () => {
        const doclet = globalFunctionDoclet;
        const node = new JsDocFunctionNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'functions', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Function', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.scope, doclet.scope, 'Did not add the "scope" property as expected.');
        assert.deepEqual(node.fires, [], 'Did not add the "fires" property as expected.');
        assert.equal(Array.isArray(node.examples), true, 'Did not attempt to add the "examples" property as expected.');
        assert.equal(Array.isArray(node.parameters), true, 'Did not attempt to add the "parameters" property as expected.');
    });

    it('adds properties for a doclet which represents an instance function and fires an event', () => {
        const doclet = instanceFunctionDocletWhichFires;
        const node = new JsDocFunctionNode(doclet);
        assert.equal(node.longname, doclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'functions', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Method', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.scope, doclet.scope, 'Did not add the "scope" property as expected.');
        assert.deepEqual(node.fires, doclet.fires, 'Did not add the "fires" property as expected.');
        assert.equal(Array.isArray(node.examples), true, 'Did not attempt to add the "examples" property as expected.');
        assert.equal(Array.isArray(node.parameters), true, 'Did not attempt to add the "parameters" property as expected.');
    });
});
