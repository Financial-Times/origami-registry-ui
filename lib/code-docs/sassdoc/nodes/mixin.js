'use strict';

const BaseNode = require('./base');

class MixinNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.kind = 'mixin';
        this.output = doclet.output || '';
        this.content = doclet.content || '';
        this.addAliases(doclet);
        this.addParameters(doclet);
    }
};

module.exports = MixinNode;
