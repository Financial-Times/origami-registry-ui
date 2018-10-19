'use strict';

const BaseNode = require('./base');

class MixinNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'mixins';
        this.label = 'Mixin';
    }
};

module.exports = MixinNode;
