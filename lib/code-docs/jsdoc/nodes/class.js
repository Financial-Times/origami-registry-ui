'use strict';

const BaseNode = require('./base');

class ClassNode extends BaseNode {
    constructor(doclet, allSupportedDoclets) {
        super(doclet);
        this.group = 'classes';
        this.label = doclet.meta && doclet.meta.code && doclet.meta.code.type === 'ClassDeclaration' ? 'Class' : 'Constructor Function';
        this.description = this.replaceLinks(doclet.classdesc) || '';
        this.extends = doclet.augments || [];
        this.fires = doclet.fires || [];
        this.constructor = {
            'name': doclet.name,
            'description': this.replaceLinks(doclet.description) || '',
            'parameters': [
            ],
            'examples': []
        };
        this.addExamples(doclet, this.constructor);
        this.addParameters(doclet, this.constructor, allSupportedDoclets);
    }
};

module.exports = ClassNode;
