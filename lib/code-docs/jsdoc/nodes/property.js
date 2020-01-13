'use strict';

const BaseNode = require('./base');

class PropertyNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'properties';
        this.label = 'Property';
        this.scope = doclet.scope;
        this.types = doclet.type && doclet.type.names ? doclet.type.names : []; // multiple types
    }
};

module.exports = PropertyNode;
