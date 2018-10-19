'use strict';

module.exports.comprehensiveDoclet = {
    'description': '',
    'commentRange': {
        'start': 1,
        'end': 6
    },
    'context': {
        'type': 'function',
        'name': 'oTestComponentTell',
        'code': '\n    @if $keep-quiet {\n        @return null;\n    }\n    @if $truth {\n        @return \'Copy-pasta: This code has an author.\';\n    }\n    @return \'I made this.\';\n',
        'line': {
            'start': 7,
            'end': 15
        }
    },
    'link': [
        {
            'url': 'https://www.google.co.uk/',
            'caption': ''
        }
    ],
    'author': [
        'Jane Madeup Smith',
        'John Madeup Smith'
    ],
    'parameter': [
        {
            'type': 'Bool',
            'name': 'keep-quiet',
            'default': 'false',
            'description': 'Whether to tell (default) or keep quiet.'
        },
        {
            'type': 'Bool',
            'name': 'truth',
            'default': 'true',
            'description': 'Whether to tell the truth (default) or lie.'
        }
    ],
    'return': {
        'type': 'String|Null',
        'description': 'A made-up sentence.'
    },
    'access': 'public',
    'group': [
        'undefined'
    ],
    'require': [],
    'file': {
        'path': 'src/scss/_functions.scss',
        'name': '_functions.scss'
    },
    'aliased': [
        'oTestComponentDoTell'
    ]
};

module.exports.simpleDoclet = {
    'description': '',
    'commentRange': {
        'start': 1,
        'end': 6
    },
    'context': {
        'type': 'function',
        'name': 'oTestComponentTell',
        'code': '\n    @if $keep-quiet {\n        @return null;\n    }\n    @if $truth {\n        @return \'Copy-pasta: This code has an author.\';\n    }\n    @return \'I made this.\';\n',
        'line': {
            'start': 7,
            'end': 15
        }
    },
    'access': 'public',
    'group': [
        'undefined'
    ],
    'require': [],
    'file': {
        'path': 'src/scss/_functions.scss',
        'name': '_functions.scss'
    }
};
