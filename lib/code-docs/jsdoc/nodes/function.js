'use strict';

const BaseNode = require('./base');

class FunctionNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'functions';
        this.label = ['static', 'instance'].includes(doclet.scope) ? 'Method' : 'Function';
        this.scope = doclet.scope;
        this.fires = doclet.fires || [];
        this.addExamples(doclet);
        this.addParameters(doclet);
        this.addReturns(doclet);
    }
};

module.exports = FunctionNode;
