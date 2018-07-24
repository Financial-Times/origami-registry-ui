'use strict';

const BaseNode = require('./base');

class PropertyNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'properties';
        this.label = 'Property';
        this.type = doclet.type && doclet.type.length !== 0 ? doclet.type : []; // multiple types
    }
};

module.exports = PropertyNode;