'use strict';

const assert = require('proclaim');
const SassDocNav = require('../../../../../lib/code-docs/sassdoc/nav');
const SassDoc = require('../../../../../lib/code-docs/sassdoc');
const NavNode = require('../../../../../lib/code-docs/nav-node');
const MixinDoclet = require('../../../mock/code-docs/sassdoc/mixin');
const FunctionDoclet = require('../../../mock/code-docs/sassdoc/function');
const VariableDoclet = require('../../../mock/code-docs/sassdoc/variable');

describe('lib/code-docs/sassdoc/nav', () => {
    describe('createNavigation', () => {
        const testSassDoc = new SassDoc('o-test-component', 'master', [
            FunctionDoclet.simpleDoclet,
            FunctionDoclet.comprehensiveDoclet,
            VariableDoclet.simpleDoclet,
            VariableDoclet.comprehensiveDoclet,
            MixinDoclet.simpleDoclet,
            MixinDoclet.comprehensiveDoclet,
        ]);
        const testSassDocNav = SassDocNav.createNavigation(testSassDoc);
        it('creates a subnav of the mixins', () => {
            const mixinSubnav = testSassDocNav.find(navNode => navNode.title.toLowerCase().includes('mixin'));
            assert.ok(mixinSubnav);
            const expectedItemName = MixinDoclet.simpleDoclet.context.name;
            const mixinNavItem = mixinSubnav.items.find(navNode => navNode.title.toLowerCase().includes(expectedItemName.toLowerCase()));
            assert.isTrue(mixinNavItem instanceof NavNode);
        });
        it('creates a subnav of the functions', () => {
            const functionSubnav = testSassDocNav.find(navNode => navNode.title.toLowerCase().includes('function'));
            assert.ok(functionSubnav);
            const expectedItemName = FunctionDoclet.simpleDoclet.context.name;
            const functionNavItem = functionSubnav.items.find(navNode => navNode.title.toLowerCase().includes(expectedItemName.toLowerCase()));
            assert.isTrue(functionNavItem instanceof NavNode);
        });
        it('creates a subnav of the variables', () => {
            const variableSubnav = testSassDocNav.find(navNode => navNode.title.toLowerCase().includes('variable'));
            assert.ok(variableSubnav);
            const expectedItemName = VariableDoclet.simpleDoclet.context.name;
            const variableNavItem = variableSubnav.items.find(navNode => navNode.title.toLowerCase().includes(expectedItemName.toLowerCase()));
            assert.isTrue(variableNavItem instanceof NavNode);
        });
        it('orders nav mixins then functions then variables', () => {
            assert.ok(testSassDocNav[0].title.toLowerCase().includes('mixin'));
            assert.ok(testSassDocNav[1].title.toLowerCase().includes('function'));
            assert.ok(testSassDocNav[2].title.toLowerCase().includes('variable'));
        });
    });
});
