'use strict';

const assert = require('proclaim');
const JsDocEventNode = require('../../../../../../lib/code-docs/jsdoc/nodes/event');

describe('lib/code-docs/jsdoc/nodes/event', () => {
    const eventDoclet = {
        'comment': '/**\n\t * Snowball event.\n\t *\n\t * @event Hurl#snowball\n\t * @type {object}\n\t * @property {boolean} detail.isPacked - Indicates whether the snowball is tightly packed.\n\t */',
        'meta': {
            'filename': 'event.js',
            'lineno': 15,
            'columnno': 1,
            'path': '/src/js',
            'code': {}
        },
        'description': 'Snowball event.',
        'kind': 'event',
        'name': 'snowball',
        'type': {
            'names': [
                'object'
            ]
        },
        'properties': [
            {
                'type': {
                    'names': [
                        'boolean'
                    ]
                },
                'description': 'Indicates whether the snowball is tightly packed.',
                'name': 'detail.isPacked'
            }
        ],
        'memberof': 'Hurl',
        'longname': 'Hurl#event:snowball',
        'scope': 'instance'
    };

    const simpleEventDoclet = {
        'comment': '/**\n\t * Snowball event.\n\t *\n\t * @event Hurl#snowball\n\t */',
        'meta': {
            'filename': 'event.js',
            'lineno': 15,
            'columnno': 1,
            'path': '/src/js',
            'code': {}
        },
        'kind': 'event',
        'name': 'snowball',
        'memberof': 'Hurl',
        'longname': 'Hurl#event:snowball',
        'scope': 'instance'
    };

    it('adds properties for a doclet which represents an event', () => {
        const node = new JsDocEventNode(eventDoclet);
        assert.equal(node.longname, eventDoclet.longname, 'Did not add the "longname" property as expected.');
        assert.equal(node.group, 'events', 'Did not add the "group" property as expected.');
        assert.equal(node.label, 'Event', 'Did not add the "label" property as expected.');
        assert.deepEqual(node.type, ['object'], 'Did not add the "type" property as expected.');
        assert.deepEqual(node.examples, [], 'Did not add the "examples" property as expected.');
        assert.deepEqual(node.properties, [
            {
                'name': eventDoclet.properties[0].name,
                'type': eventDoclet.properties[0].type.names,
                'description': eventDoclet.properties[0].description
            }
        ], 'Did not add the "properties" property as expected.');
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
