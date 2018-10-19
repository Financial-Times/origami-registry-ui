'use strict';

const assert = require('proclaim');
const SassDocMixinNode = require('../../../../../../lib/code-docs/sassdoc/nodes/mixin');
const MixinDoclet = require('../../../../mock/code-docs/sassdoc/mixin');

describe('lib/code-docs/sassdoc/nodes/mixin', () => {
    const comprehensiveNode = new SassDocMixinNode(MixinDoclet.comprehensiveDoclet);
    const simpleNode = new SassDocMixinNode(MixinDoclet.simpleDoclet);
    it('creates a mixin node from a mixin doclet', () => {
        assert.isTrue(simpleNode instanceof SassDocMixinNode);
        assert.isTrue(comprehensiveNode instanceof SassDocMixinNode);
    });
    it('has an output property', () => {
        assert.equal(simpleNode.output, '');
        assert.equal(comprehensiveNode.output, 'Modifiying, cosmetic styles');
    });
    it('has a content property', () => {
        assert.equal(simpleNode.content, '');
        assert.equal(comprehensiveNode.content, 'Extra styles to modify test component theme.');
    });
    it('has a kind property', () => {
        assert.equal(simpleNode.kind, 'mixin');
        assert.equal(comprehensiveNode.kind, 'mixin');
    });
    it('has a blank aliases property if the mixin doclet defines no alias', () => {
        assert.deepEqual(comprehensiveNode.aliases, [
            'oTestComponentCustomTheme'
        ]);
    });
    it('has an aliases property if the mixin doclet has an alias', () => {
        assert.deepEqual(simpleNode.aliases, []);
    });
    it('has a parameters property if the mixin doclet defines parameters', () => {
        assert.deepEqual(comprehensiveNode.parameters, [
            {
                'type': ['Map'],
                'name': 'theme',
                'description': 'Apply a custom theme to the component. Theme keys include \'primary-color\' and \'secondary-color\' (see example).',
                'optional': false
            }
        ]);
    });
    it('has a blank parameters property if the mixin doclet has no parameters', () => {
        assert.deepEqual(simpleNode.parameters, []);
    });
});
