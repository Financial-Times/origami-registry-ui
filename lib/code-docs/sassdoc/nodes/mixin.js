'use strict';

const BaseNode = require('./base');

class MixinNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.kind = 'mixin';
        this.addExamples(doclet);
    }
};

module.exports = MixinNode;
