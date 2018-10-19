'use strict';

const BaseNode = require('./base');

class VariableNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.kind = 'variable';
        this.types = this.parseTypes(doclet.type);
        this.addAliases(doclet);
    }
};

module.exports = VariableNode;
