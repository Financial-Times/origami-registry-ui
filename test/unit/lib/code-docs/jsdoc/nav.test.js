'use strict';

const assert = require('proclaim');
const sinon = require('sinon');
const JsDocNav = require('../../../../../lib/code-docs/jsdoc/nav');
const JsDoc = require('../../../../../lib/code-docs/jsdoc');

describe('lib/code-docs/jsdoc/nav', () => {
    // Mock nodes (simplified)
    // @see lib/code-docs/nodes/
    const classNode = {
        kind: 'class',
        group: 'classes',
        label: 'Class',
        name: 'TestDoclet',
        longname: 'TestDoclet',
    };
    const memberPropertyNode = {
        kind: 'member',
        group: 'properties',
        label: 'Property',
        name: 'name',
        longname: 'TestDoclet#name',
        memberof: 'TestDoclet'
    };
    const memberFunctionNode = {
        kind: 'function',
        group: 'functions',
        label: 'Method',
        name: 'helloWorld',
        longname: 'TestDoclet#helloWorld',
        memberof: 'TestDoclet'
    };
    const memberEventNode = {
        kind: 'event',
        group: 'events',
        label: 'Event',
        name: 'componentReady',
        longname: 'TestDoclet#event:componentReady',
        memberof: 'TestDoclet',
    };
    const propertyNode = {
        kind: 'member',
        group: 'properties',
        label: 'Property',
        name: 'thing',
        longname: 'thing',
    };
    const functionNode = {
        kind: 'function',
        group: 'functions',
        label: 'Function',
        name: 'sayHello',
        longname: 'sayHello'
    };

    it('creates hierarchical nav of classes with properties and functions in a subnav', () => {
        const jsDoc = new JsDoc([]);
        sinon.stub(jsDoc, 'getNodes').callsFake(() => {
            return [
                classNode,
                memberPropertyNode,
                memberFunctionNode
            ];
        });
        sinon.stub(jsDoc, 'getNodesByTypeWithMembers').callsFake(() => {
            const classWithMembers = classNode;
            classWithMembers.properties = [memberPropertyNode];
            classWithMembers.functions = [memberFunctionNode];
            return {
                classes: [classWithMembers]
            };
        });
        const nav = JsDocNav.createNavigation(jsDoc);
        // Check the class node is in the root of the nav.
        const classSubNav = nav.find(subnav => subnav.title === classNode.name);
        assert.equal(typeof classSubNav, 'object', 'Did not add the class node to the root of the nav by its name.');
        // Check the class node has a subnav with its constructor, properties, and methods.
        const classConstructorSubNavItem = classSubNav.items.find(subnav => subnav.title.includes('Constructor'));
        assert.equal(typeof classConstructorSubNavItem, 'object', 'Did not add the class\'s constructor to a subnav.');
        const classPropertiesSubNav = classSubNav.items.find(subnav => subnav.title.includes(memberPropertyNode.name));
        assert.equal(typeof classPropertiesSubNav, 'object', 'Did not add the class\'s property to a subnav.');
        const classFunctionsSubNav = classSubNav.items.find(subnav => subnav.title.includes(memberFunctionNode.name));
        assert.equal(typeof classFunctionsSubNav, 'object', 'Did not add the class\'s function to a sub nav.');
    });

    it('creates a "global" nav item for nodes which are not a member of another node', () => {
        const jsDoc = new JsDoc([]);
        sinon.stub(jsDoc, 'getNodes').callsFake(() => {
            return [
                propertyNode,
                functionNode
            ];
        });
        sinon.stub(jsDoc, 'getNodesByTypeWithMembers').callsFake(() => {
            return {
                properties: [propertyNode],
                functions: [functionNode]
            };
        });
        const nav = JsDocNav.createNavigation(jsDoc);
        // Check a global node is in the root of the nav with the global property and function.
        const globalSubNav = nav.find(subnav => subnav.title === 'Global');
        assert.equal(typeof globalSubNav, 'object', 'Did not add global nodes to the root of the nav.');
    });

    it('creates an "events" nav item for all events', () => {
        const jsDoc = new JsDoc([]);
        sinon.stub(jsDoc, 'getNodes').callsFake(() => {
            return [
                classNode,
                memberEventNode,
            ];
        });
        sinon.stub(jsDoc, 'getNodesByTypeWithMembers').callsFake(() => {
            const classWithMembers = classNode;
            classWithMembers.events = [memberEventNode];
            return {
                classes: [classWithMembers]
            };
        });
        const nav = JsDocNav.createNavigation(jsDoc);
        // Check Event node is added to the root of nav reglardless of its "memberof" property.
        const eventSubNav = nav.find(subnav => subnav.title === 'Events');
        assert.equal(typeof eventSubNav, 'object', 'Did not add the event node to the root of the nav.');
        assert.equal(eventSubNav.items.length, 1, 'Did not add all the event nodes to the root of the nav as expected.');
        // Check Event node is not added under the class
        const classSubNav = nav.find(subnav => subnav.title === classNode.name);
        const classEventItem = classSubNav.items.find(subnav => subnav.title.includes(memberEventNode.name));
        assert.equal(classEventItem, undefined, 'Events should not be added as a subnav item to the class they belong to.');
    });
});
