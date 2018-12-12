'use strict';

module.exports.typeDefinition = {
    'comment': '/**\n * A document options object.\n */',
    'meta': {
        'filename': 'oComponent.js',
        'lineno': 12,
        'columnno': 1,
        'path': '/src/js',
        'code': {}
    },
    'description': 'A document options object.',
    'kind': 'typedef',
    'name': 'opts',
    'type': {
        'names': ['Object']
    },
    'properties': [
        {
            'type': {
                'names': [
                    'Bool'
                ]
            },
            'description': '[true] - Toggle the component\'s sort feature.',
            'name': 'sortable'
        },
        {
            'type': {
                'names': [
                    'Undefined',
                    'Bool'
                ]
            },
            'description': '[Undefined] - Toggle the component expand feature.',
            'name': 'expanded'
        }
    ],
    'memberof': 'OComponent',
    'longname': 'OComponent~opts',
    'scope': 'inner'
};

module.exports.classWithTypeDefinitionParam = {
    'comment': '/**\n * A class with an options parameter.\n */',
    'meta': {
        'range': [
            1057,
            1451
        ],
        'filename': 'oComponent.js',
        'lineno': 27,
        'columnno': 1,
        'path': '/src/js',
        'code': {
            'id': 'astnode100003801',
            'name': 'OComponent',
            'type': 'MethodDefinition',
            'paramnames': [
                'rootEl',
                'opts'
            ]
        },
        'vars': {
            '': null
        }
    },
    'description': 'A class with an options parameter.',
    'params': [
        {
            'type': {
                'names': [
                    'HTMLElement'
                ]
            },
            'description': 'An o-component element.',
            'name': 'rootEl'
        },
        {
            'type': {
                'names': [
                    'OComponent~opts'
                ]
            },
            'variable': true,
            'description': 'An options object.',
            'name': 'opts'
        }
    ],
    'returns': [
        {
            'type': {
                'names': [
                    'OComponent'
                ]
            },
            'description': '- A component instance.'
        }
    ],
    'name': 'OComponent',
    'longname': 'OComponent',
    'kind': 'class',
    'scope': 'global'
};

module.exports.functionTypeDefinition = {
    'comment': '/**\n\t * A callback function `myCallback`.\n\t *\n\t * @callback myCallback\n\t * @param {HTMLElement} cell\n\t * @return {String|Object}\n\t */',
    'meta': {
        'filename': 'oComponent.js',
        'lineno': 249,
        'columnno': 1,
        'path': '/src/js',
        'code': {}
    },
    'description': 'A callback function `myCallback',
    'kind': 'typedef',
    'name': 'myCallback',
    'type': {
        'names': [
            'function'
        ]
    },
    'params': [
        {
            'type': {
                'names': [
                    'HTMLElement'
                ]
            },
            'name': 'cell'
        }
    ],
    'returns': [
        {
            'type': {
                'names': [
                    'String',
                    'Object'
                ]
            }
        }
    ],
    'longname': 'myCallback',
    'scope': 'global'
};

