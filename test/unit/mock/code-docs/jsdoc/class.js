'use strict';

module.exports.constructorDoclet = {
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

module.exports.classDeclarationDoclet = {
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
