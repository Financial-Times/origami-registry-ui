'use strict';

const assert = require('proclaim');
const JsDocEventNode = require('../../../../../../lib/code-docs/jsdoc/nodes/event');
const EventDoclet = require('../../../../mock/code-docs/jsdoc/event');

describe('lib/code-docs/jsdoc/nodes/event', () => {
    const eventDoclet = EventDoclet.eventDoclet;
    const simpleEventDoclet = EventDoclet.simpleEventDoclet;

    it('adds properties for a doclet which represents an event', () => {
        const node = new JsDocEventNode(eventDoclet);
        assert.equal(node.longname, eventDoclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'events', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Event', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.type, ['object'], 'Did not add the "type" property as expected.');
        assert.deepEqual(node.examples, [], 'Did not add the "examples" property as expected.');
        assert.deepEqual(node.properties, [{
            'description': 'Indicates whether the snowball is tightly packed.',
            'name': 'detail.isPacked',
            'type': [ 'boolean' ]
        }], 'Did not add the "properties" property as expected.');
    });

    it('adds properties for a event doclet which has no type or properties defined ', () => {
        const node = new JsDocEventNode(simpleEventDoclet);
        assert.equal(node.longname, eventDoclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'events', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Event', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.type, [], 'Did not add the "type" property as expected.');
        assert.deepEqual(node.examples, [], 'Did not add the "examples" property as expected.');
        assert.deepEqual(node.properties, [], 'Did not add the "properties" property as expected.');
    });
});
