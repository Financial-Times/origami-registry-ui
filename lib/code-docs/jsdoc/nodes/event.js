'use strict';

const BaseNode = require('./base');

class EventNode extends BaseNode {
    constructor(doclet) {
        super(doclet);
        this.group = 'events';
        this.label = 'Event';
        this.addExamples(doclet);
        this.addParameters(doclet);
    }
};

module.exports = EventNode;