'use strict';

const BaseNode = require('./base');

class ModuleNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'modules';
        this.label = 'Module';
        this.addExamples(doclet);
        this.addParameters(doclet);
        this.addReturns(doclet);
    }
};

module.exports = ModuleNode;
