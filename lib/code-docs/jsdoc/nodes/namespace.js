'use strict';

const BaseNode = require('./base');

class NamespaceNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'namespaces';
        this.label = 'Namespace';
    }
};

module.exports = NamespaceNode;
