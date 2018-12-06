'use strict';

const BaseNode = require('./base');

class TypedefNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'typedefs';
        this.label = 'Typedef';
        this.addReturns(doclet);
        this.addExamples(doclet);
        this.addParameters(doclet);
        this.addProperties(doclet);
    }

    addTypeDefTypes(doclet) {
        this.types = doclet.type && Array.isArray(doclet.type.names) ? doclet.type.names : [];
    }
};

module.exports = TypedefNode;
