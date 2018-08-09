'use strict';

const assert = require('proclaim');
const SassDocBaseNode = require('../../../../../../lib/code-docs/sassdoc/nodes/base');
const Example = require('../../../../../../lib/code-docs/example');

describe('lib/code-docs/sassdoc/nodes/base', () => {

    const comprehensiveDoclet = {
        'description': '',
        'commentRange': {
            'start': 17,
            'end': 23
        },
        'context': {
            'type': 'function',
            'name': 'oTestComponentDouble',
            'code': '\n    @return 2 * $scale;\n',
            'line': {
                'start': 24,
                'end': 26
            }
        },
        'group': [
            'helpers'
        ],
        'return': {
            'type': 'Number'
        },
        'example': [
            {
                'type': 'scss',
                'code': 'oTestComponentDouble(2) //4'
            },
            {
                'type': 'scss',
                'code': 'oTestComponentDouble(10) //20'
            }
        ],
        'deprecated': 'This function has been replaced. Please contact Origami with any questions.',
        'access': 'public',
        'require': [],
        'file': {
            'path': 'src/scss/_functions.scss',
            'name': '_functions.scss'
        },
        'brand': {
            'supported': [
                'master'
            ],
            'description': 'Only master brand supported in this example'
        },
        'link': [
            {
                'url': 'https://www.google.co.uk/',
                'caption': ''
            }
        ],
        'parameter': [
            {
                'type': 'Number',
                'name': 'toDouble',
                'description': 'The number to double'
            }
        ],
        'aliased': [
            'oTestComponentDoubler'
        ]
    };

    const simpleDoclet = {
        'description': '',
        'commentRange': {
            'start': 17,
            'end': 23
        },
        'context': {
            'type': 'function',
            'name': 'oTestComponentDouble',
            'code': '\n    @return 2 * $scale;\n',
            'line': {
                'start': 24,
                'end': 26
            }
        },
        'group': [
            undefined
        ],
        'access': 'public',
        'require': [],
        'file': {
            'path': 'src/scss/_functions.scss',
            'name': '_functions.scss'
        }
    };

    it('creates a node to represent a complex SassDoc doclet with basic properties', () => {
        const doclet = comprehensiveDoclet;
        const node = new SassDocBaseNode(doclet);
        assert.equal(node.name, 'oTestComponentDouble', 'Did not add expected name property.');
        assert.equal(node.description, '', 'Did not add expected description property.');
        assert.equal(node.longname, 'helpers-function-oTestComponentDouble', 'Did not add expected longname property.');
        assert.deepEqual(node.file, {
            'path': 'src/scss/_functions.scss',
            'name': '_functions.scss',
            'lineno': 24
        }, 'Did not add expected file property.');
        assert.deepEqual(node.group, {
            key: 'helpers',
            name: 'helpers'
        }, 'Did not add expected group property.');
        assert.deepEqual(node.brand, {
            description: 'Only master brand supported in this example',
            supported: ['master']
        }, 'Did not add expected brand property.');
        assert.equal(node.deprecated, 'This function has been replaced. Please contact Origami with any questions.', 'Did not add expected deprecated property.');
        assert.deepEqual(node.links, [
            {
                'url': 'https://www.google.co.uk/',
                'caption': ''
            }
        ], 'Did not add expected links property.');
        assert.deepEqual(node.examples, [
            new Example('oTestComponentDouble(2) //4', 'scss'),
            new Example('oTestComponentDouble(10) //20', 'scss')
        ], 'Did not add expected examples property.');
    });

    it('creates a node to represent a simple SassDoc doclet with basic properties', () => {
        const doclet = simpleDoclet;
        const node = new SassDocBaseNode(doclet);
        assert.equal(node.name, 'oTestComponentDouble', 'Did not add expected name property.');
        assert.equal(node.description, '', 'Did not add expected description property.');
        assert.equal(node.longname, 'function-oTestComponentDouble', 'Did not add expected longname property.');
        assert.deepEqual(node.file, {
            'path': 'src/scss/_functions.scss',
            'name': '_functions.scss',
            'lineno': 24
        }, 'Did not add expected file property.');
        assert.deepEqual(node.group, {
            key: '',
            name: ''
        }, 'Did not add expected group property.');
        assert.deepEqual(node.links, [], 'Expect an empty links array.');
        assert.deepEqual(node.examples, [], 'Expect an empty examples array.');
        assert.equal(node.brand, undefined, 'Did not expect a brand property on the simple SassDoc example.');
        assert.equal(node.deprecated, undefined, 'Did not expect a deprecation notice on the simple SassDoc example.');
    });

    it('if provided the groupName property added by SassDoc extras is used for the node group property', () => {
        // @see https://github.com/SassDoc/sassdoc-extras/blob/2.4.3/src/groupName.js#L30
        const simpleExampleDoclet = simpleDoclet;
        simpleExampleDoclet.groupName = {
            // group : label
            undefined: 'o-example'
        };
        const simpleNode = new SassDocBaseNode(simpleExampleDoclet);
        assert.deepEqual(simpleNode.group, {
            key: '',
            name: 'o-example'
        });

        const comprehensiveExampleDoclet = comprehensiveDoclet;
        comprehensiveExampleDoclet.groupName = {
            // group : label
            'helpers': 'Utils'
        };
        const comprehensiveNode = new SassDocBaseNode(comprehensiveExampleDoclet);
        assert.deepEqual(comprehensiveNode.group, {
            key: 'helpers',
            name: 'Utils'
        });
    });

    describe('addAliases', () => {
        it('Adds aliases to the node', () => {
            const doclet = comprehensiveDoclet;
            const node = new SassDocBaseNode(doclet);
            node.addAliases(doclet);
            assert.deepEqual(node.aliases, ['oTestComponentDoubler'], 'Did not add expected aliases property.');
        });

        it('Adds an empty aliases array for doclets which have no aliases', () => {
            const doclet = simpleDoclet;
            const node = new SassDocBaseNode(doclet);
            node.addAliases(doclet);
            assert.deepEqual(node.aliases, []);
        });
    });

    describe('addParameters', () => {
        it('Adds parameters to the node', () => {
            const doclet = comprehensiveDoclet;
            const node = new SassDocBaseNode(doclet);
            node.addParameters(doclet);
            assert.deepEqual(node.parameters, [{
                name: 'toDouble',
                type: ['Number'],
                description: 'The number to double',
                default: '',
                optional: false
            }], 'Did not add expected parameters property.');
        });

        it('Adds an empty parameters array for doclets which have no parameters', () => {
            const doclet = simpleDoclet;
            const node = new SassDocBaseNode(doclet);
            node.addParameters(doclet);
            assert.deepEqual(node.parameters, []);
        });
    });

    describe('parseTypes', () => {
        it('Transform a string of SassDoc types to an array.', () => {
            const doclet = comprehensiveDoclet;
            const node = new SassDocBaseNode(doclet);
            assert.deepEqual(node.parseTypes('Color | Null'), ['Color', 'Null']);
            assert.deepEqual(node.parseTypes(''), []);
        });
    });
});
