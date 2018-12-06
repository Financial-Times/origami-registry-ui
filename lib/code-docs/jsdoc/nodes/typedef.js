'use strict';

const BaseNode = require('./base');

class TypedefNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'typedefs';
        this.label = 'Typedef';
        this.addTypes(doclet);
        this.addReturns(doclet);
        this.addExamples(doclet);
        this.addParameters(doclet);
        this.addProperties(doclet);
    }
};

module.exports = TypedefNode;
