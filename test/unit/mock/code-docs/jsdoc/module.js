'use strict';

module.exports.moduleDoclet = {
    'comment': '/**\n * Tests a single export module.\n * @module SimpleModule\n * @see module:example-module for an example of multi export module documentation.\n * @returns {String} Returns a fixed string.\n */',
    'meta': {
        'filename': 'simple-module.js',
        'lineno': 1,
        'columnno': 0,
        'path': '/src/js',
        'code': {}
    },
    'description': 'Tests a single export module.',
    'kind': 'module',
    'name': 'SimpleModule',
    'see': [
        'module:example-module for an example of multi export module documentation.'
    ],
    'returns': [
        {
            'type': {
                'names': [
                    'String'
                ]
            },
            'description': 'Returns a fixed string.'
        }
    ],
    'longname': 'module:SimpleModule'
};
