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
    };

    it('creates a node to represent a SassDoc doclet with basic properties', () => {
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

    describe('addAliases', () => {

    });

    describe('addParameters', () => {
        const doclet = comprehensiveDoclet;
        const node = new SassDocBaseNode(doclet);
        node.addParameters(doclet);
        console.log(node.parameters);
        assert.deepEqual(node.parameters, [{
            name: 'toDouble',
            type: ['Number'],
            description: 'The number to double',
            default: '',
            optional: false
        }], 'Did not add expected parameters property.');
    });

    describe('parseTypes', () => {

    });
});
