'use strict';

const BaseNode = require('./base');

class NamespaceNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'namespaces';
        this.label = 'Namespace';
        this.addExamples(doclet);
        this.addParameters(doclet);
    }
};

module.exports = NamespaceNode;