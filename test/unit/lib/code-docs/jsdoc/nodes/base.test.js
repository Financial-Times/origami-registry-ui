'use strict';

const assert = require('proclaim');
const JsDocBaseNode = require('../../../../../../lib/code-docs/jsdoc/nodes/base');
const Example = require('../../../../../../lib/code-docs/example');

describe('lib/code-docs/jsdoc/nodes/base', () => {
    const comprehensiveDoclet = {
        'comment': '/**\n * A description of the function.\n * And {@link http://usejsdoc.org/tags-function.html a link}.\n * @param {string} worldName\n */',
        'meta': {
            'range': [
                560,
                626
            ],
            'filename': 'test-doclet.js',
            'lineno': 15,
            'columnno': 0,
            'path': '/src/js',
            'code': {
                'id': 'astnode100000006',
                'name': 'TestDoclet.prototype.helloWorld',
                'type': 'FunctionDeclaration',
                'paramnames': [
                    'worldName'
                ]
            }
        },
        'description': 'A description of the function.\nAnd {@link http://usejsdoc.org/tags-function.html a link}.',
        'params': [
            {
                'type': {
                    'names': [
                        'String'
                    ]
                },
                'description': 'Name of the world to say hello to e.g. Earth.',
                'name': 'worldName'
            }
        ],
        'returns': [
            {
                'type': {
                    'names': [
                        'String'
                    ]
                },
                'description': 'Returns a hello.'
            }
        ],
        'name': 'helloWorld',
        'longname': 'TestDoclet#helloWorld',
        'kind': 'function',
        'scope': 'instance',
        'deprecated': 'See {@link http://example.com} for details.',
        'access': 'private',
        'examples': [
            '// a new test doclet\nnew TestDoclet();',
            '<caption>Say hello with a TestDoclet.</caption>\n// returns "hello world"\ntestDoclet.helloWorld();'
        ],
    };

    const simpleDoclet = {
        'comment': '',
        'meta': {
            'code': {
                'id': 'astnode100000006',
                'name': 'helloWorld',
                'type': 'FunctionDeclaration',
                'paramnames': []
            }
        },
        'params': [],
        'name': 'helloWorld',
        'longname': 'helloWorld',
        'kind': 'function',
        'scope': 'global'
    };

    it('creates a node to represent a JSDoc doclet with basic properties', () => {
        const doclet = comprehensiveDoclet;
        const node = new JsDocBaseNode(doclet);
        assert.equal(node.name, doclet.name, 'Did not add name property.');
        assert.equal(node.longname, doclet.longname, 'Did not add longname property.');
        assert.equal(node.kind, doclet.kind, 'Did not add kind property.');
        assert.equal(node.memberof, doclet.memberof, 'Did not add memberof property.');
        assert.equal(node.access, doclet.access, 'Did not add access property.');
        assert.equal(node.description,
            'A description of the function.\nAnd [a link](http://usejsdoc.org/tags-function.html).'
            , 'Did not add description property with links replaced correctly.');
        assert.equal(node.deprecated,
            'See [http://example.com](http://example.com) for details.'
            , 'Did not add deprecated property, with deprecation message and links replaced correctly.');
        assert.strictEqual(node.virtual, false, 'Did not add `false` virtual property.');
        assert.deepEqual(node.file, {
            path: doclet.meta.path,
            name: doclet.meta.filename,
            lineno: doclet.meta.lineno,
            columnno: doclet.meta.columnno
        }, 'Did not add file information as expected.');
    });

    describe('replaceLinks()', () => {
        it('Replaces @link tags of a given string', () => {
            const doclet = comprehensiveDoclet;
            const node = new JsDocBaseNode(doclet);
            const linkCopy = [
                {
                    'original': 'Copy with a namepath link {@link fooBar}',
                    'expected': 'Copy with a namepath link [fooBar](#fooBar)'
                },
                {
                    'original': 'Copy with a web link {@link http://usejsdoc.org/tags-function.html}.',
                    'expected': 'Copy with a web link [http://usejsdoc.org/tags-function.html](http://usejsdoc.org/tags-function.html).'
                },
                {
                    'original': 'Copy with {@link fooBar a namepath link}.',
                    'expected': 'Copy with [a namepath link](#fooBar).'
                },
                {
                    'original': 'Copy with {@link http://usejsdoc.org/tags-function.html a web link}.',
                    'expected': 'Copy with [a web link](http://usejsdoc.org/tags-function.html).'
                },
                {
                    'original': 'Copy with [another namepath link]{@link fooBar}',
                    'expected': 'Copy with [another namepath link](#fooBar)'
                },
                {
                    'original': 'Copy with [another web link]{@link http://usejsdoc.org/tags-function.html}',
                    'expected': 'Copy with [another web link](http://usejsdoc.org/tags-function.html)'
                }
            ];

            linkCopy.forEach(linkCopy => {
                assert.equal(node.replaceLinks(
                    linkCopy.original),
                    linkCopy.expected,
                    `Did not replace @link tags as expected for "${linkCopy.original}"`
                );
            });
        });
    });

    describe('addExamples()', () => {
        it('Adds doclet examples to node', () => {
            const doclet = comprehensiveDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addExamples(doclet);
            assert.deepEqual(node.examples, [
                new Example('// a new test doclet\nnew TestDoclet();', 'js'),
                new Example('// returns "hello world"\ntestDoclet.helloWorld();', 'js', 'Say hello with a TestDoclet.')
            ], 'Did not add examples as expected.');
        });
        it('Adds empty examples array to node if the doclet has no examples', () => {
            const doclet = simpleDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addExamples(doclet);
            assert.deepEqual(node.examples, [], 'Did not add empty examples array.');
        });
    });

    describe('addParameters()', () => {
        it('Adds doclet parameters to node', () => {
            const doclet = comprehensiveDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addParameters(doclet);
            assert.deepEqual(node.parameters, [
                {
                    'name': doclet.params[0].name,
                    'types': [{ name: 'String' }],
                    'description': doclet.params[0].description,
                    'default': '',
                    'optional': '',
                    'nullable': ''
                }
            ], 'Did not add parameters as expected.');
        });
        it('Adds custom parameter "types" property from doclets (added by the registry) to node', () => {
            const doclet = comprehensiveDoclet;
            // Add custom param type mock.
            doclet.params[0].types = [
                {
                    name: 'String'
                },
                {
                    name: 'opts',
                    longname: 'Thing~opts'
                }
            ];
            const node = new JsDocBaseNode(doclet);
            node.addParameters(doclet);
            assert.deepEqual(
                node.parameters[0].types,
                [{ name: 'String' }, { name: 'opts', longname: 'Thing~opts' }],
                'Did not add custom parameter types as expected.'
            );
        });
        it('Adds empty parameters array to node if the doclet has no parameters', () => {
            const doclet = simpleDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addParameters(doclet);
            assert.deepEqual(node.parameters, [], 'Did not add empty parameters array.');
        });
    });

    describe('addReturns()', () => {
        it('Adds doclet return data to node', () => {
            const doclet = comprehensiveDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addReturns(doclet);
            assert.deepEqual(node.returns, {
                'types': ['String'],
                'description': 'Returns a hello.'
            }, 'Did not add return data as expected.');
        });
        it('Does not add return data if the doclet has no return value', () => {
            const doclet = simpleDoclet;
            const node = new JsDocBaseNode(doclet);
            node.addReturns(doclet);
            assert.deepEqual(node.returns, undefined, 'Should not add returns property for a doclet with no return value.');
        });
    });
});
