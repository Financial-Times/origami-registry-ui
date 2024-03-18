'use strict';

const assert = require('proclaim');
const SassDoc = require('../../../../../lib/code-docs/sassdoc');
const sassDocExampleData = require('../../../../../test/sassdoc.json');
const Mixin = require('../../../../../lib/code-docs/sassdoc/nodes/mixin');
const Function = require('../../../../../lib/code-docs/sassdoc/nodes/function');
const Variable = require('../../../../../lib/code-docs/sassdoc/nodes/variable');

describe('lib/code-docs/sassdoc/index', () => {
    const coreBrandSassDoc = new SassDoc('o-example', 'core', sassDocExampleData);
    const internalBrandSassDoc = new SassDoc('o-example', 'internal', sassDocExampleData);

    describe('getNodesByKind', () => {
        const coreBrandNodesByKind = coreBrandSassDoc.getNodesByKind();
        it('Returns an object with the expected number of mixins for the core brand', () => {
            assert.equal(coreBrandNodesByKind.mixin.length, 7);
        });
        it('Returns an object with the expected number of functions for the core brand', () => {
            assert.equal(coreBrandNodesByKind.function.length, 2);
        });
        it('Returns an object with the expected number of variables for the core brand', () => {
            assert.equal(coreBrandNodesByKind.variable.length, 4);
        });
    });

    describe('getNodes', () => {
        const coreBrandNodes = coreBrandSassDoc.getNodes();
        it('Did not return array for the core brand.', () => {
            assert.isTrue(Array.isArray(coreBrandNodes));
        });
        it('Returns the expected number of formatted mixin nodes for the core brand.', () => {
            assert.equal(coreBrandNodes.filter(node => node instanceof Mixin).length, 7);
        });
        it('Returns the expected number of formatted function nodes for the core brand.', () => {
            assert.equal(coreBrandNodes.filter(node => node instanceof Function).length, 2);
        });
        it('Returns the expected number of formatted variable nodes for the core brand.', () => {
            assert.equal(coreBrandNodes.filter(node => node instanceof Variable).length, 4);
        });

        const internalBrandNodes = internalBrandSassDoc.getNodes();
        it('Did not return array for the internal brand.', () => {
            assert.isTrue(Array.isArray(internalBrandNodes));
        });
        it('Returns the expected number of formatted mixin nodes for the internal brand.', () => {
            assert.equal(
                internalBrandNodes.filter(node => node instanceof Mixin).length,
                5,
                'Expected the internal brand to have fewer mixins than the core brand in this case.'
            );
        });
        it('Returns the expected number of formatted function nodes for the internal brand.', () => {
            assert.equal(internalBrandNodes.filter(node => node instanceof Function).length, 2);
        });
        it('Returns the expected number of formatted variable nodes for the internal brand.', () => {
            assert.equal(internalBrandNodes.filter(node => node instanceof Variable).length, 4);
        });
    });
});
