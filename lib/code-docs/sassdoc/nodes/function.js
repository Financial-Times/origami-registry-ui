'use strict';

const BaseNode = require('./base');

class FunctionNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.kind = 'function';
        this.return = {
            types: this.parseTypes(doclet.return && doclet.return.type ? doclet.return.type : ''),
            description: doclet.return && doclet.return.description ? doclet.return.description : '',
        };
        this.addAliases(doclet);
        this.addParameters(doclet);
    }
};

module.exports = FunctionNode;
