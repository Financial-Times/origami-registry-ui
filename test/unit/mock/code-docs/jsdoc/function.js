'use strict';

module.exports.globalFunctionDoclet = {
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

module.exports.instanceFunctionDocletWhichFires = {
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
