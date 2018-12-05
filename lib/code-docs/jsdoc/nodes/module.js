'use strict';

const BaseNode = require('./base');

class ModuleNode extends BaseNode {
    constructor(doclet, allSupportedDoclets) {
        super(doclet);
        this.group = 'modules';
        this.label = 'Module';
        this.addExamples(doclet);
        this.addParameters(doclet, this, allSupportedDoclets);
        this.addReturns(doclet);
    }
};

module.exports = ModuleNode;
