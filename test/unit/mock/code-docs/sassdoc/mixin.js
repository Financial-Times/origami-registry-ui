'use strict';

module.exports.comprehensiveDoclet = {
    'description': 'Applies to a test component.\n',
    'content': 'Extra styles to modify test component theme.',
    'output': 'Modifiying, cosmetic styles',
    'commentRange': {
        'start': 29,
        'end': 38
    },
    'context': {
        'type': 'mixin',
        'name': 'oTestComponentTheme',
        'code': '\n    @if type-of(theme) != \'map\' {\n        @include _oTestComponentThrowError(\'Invalid theme.\');\n    }\n    background-color: map-get($theme, $primary-color);\n    border-color: map-get($theme, $secondary-color);\n',
        'line': {
            'start': 39,
            'end': 45
        }
    },
    'example': [
        {
            'type': 'scss',
            'code': '.my-test-component {\n    @include oTestComponentBig();\n    @include oTestComponentTheme($theme: (primary-color: red, secondary-color: blue));\n}',
            'description': 'A big test component with a custom theme.'
        }
    ],
    'see': [
        {
            'description': 'The main stlyes fo a big test component.\n',
            'context': {
                'type': 'mixin',
                'name': 'oTestComponentBig',
                'code': '\n    @include _oTestComponentBase();\n    height: _oTestComponentGetSize(1);\n    width: _oTestComponentGetSize(1);\n',
                'line': {
                    'start': 2,
                    'end': 6
                }
            }
        },
        {
            'description': 'The main styles for a small test component.\n',
            'context': {
                'type': 'mixin',
                'name': 'oTestComponentSmall',
                'code': '\n    @include _oTestComponentBase();\n    height: _oTestComponentGetSize(2);\n    width: _oTestComponentGetSize(2);\n',
                'line': {
                    'start': 9,
                    'end': 13
                }
            }
        }
    ],
    'aliased': [
        'oTestComponentCustomTheme'
    ],
    'parameter': [
        {
            'type': 'Map',
            'name': 'theme',
            'description': 'Apply a custom theme to the component. Theme keys include \'primary-color\' and \'secondary-color\' (see example).'
        }
    ],
    'throw': [
        'An invalid theme will throw an error.'
    ],
    'access': 'public',
    'group': [
        'undefined'
    ],
    'require': [
        {
            'type': 'mixin',
            'name': '_oTestComponentThrowError'
        }
    ],
    'file': {
        'path': 'src/scss/_mixins.scss',
        'name': '_mixins.scss'
    }
};

module.exports.simpleDoclet = {
    'commentRange': {
        'start': 29,
        'end': 38
    },
    'context': {
        'type': 'mixin',
        'name': 'oTestComponentTheme',
        'code': '\n    @if type-of(theme) != \'map\' {\n        @include _oTestComponentThrowError(\'Invalid theme.\');\n    }\n    background-color: map-get($theme, $primary-color);\n    border-color: map-get($theme, $secondary-color);\n',
        'line': {
            'start': 39,
            'end': 45
        }
    },
    'access': 'public',
    'group': [
        'undefined'
    ],
    'file': {
        'path': 'src/scss/_mixins.scss',
        'name': '_mixins.scss'
    }
};
