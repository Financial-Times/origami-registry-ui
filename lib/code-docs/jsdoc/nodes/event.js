'use strict';

const BaseNode = require('./base');

class EventNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'events';
        this.label = 'Event';
        this.addTypes(doclet);
        this.addProperties(doclet);
        this.addExamples(doclet);
    }
};

module.exports = EventNode;
