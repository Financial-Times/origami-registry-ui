'use strict';

const assert = require('proclaim');
const SassDoc = require('../../../../../lib/code-docs/sassdoc');
const sassDocExampleData = require('../../../../../test/sassdoc.json'); //@todo replace with real data
const Mixin = require('../../../../../lib/code-docs/sassdoc/nodes/mixin');
const Function = require('../../../../../lib/code-docs/sassdoc/nodes/function');
const Variable = require('../../../../../lib/code-docs/sassdoc/nodes/variable');

describe('lib/code-docs/sassdoc/index', () => {
    const masterBrandSassDoc = new SassDoc('o-example', 'master', sassDocExampleData);
    const internalBrandSassDoc = new SassDoc('o-example', 'internal', sassDocExampleData);

    describe('getNodesByKind', () => {
        const masterBrandNodesByKind = masterBrandSassDoc.getNodesByKind();
        it('Returns an object with the expected number of mixins for the master brand', () => {
            assert.equal(masterBrandNodesByKind.mixin.length, 7);
        });
        it('Returns an object with the expected number of functions for the master brand', () => {
            assert.equal(masterBrandNodesByKind.function.length, 2);
        });
        it('Returns an object with the expected number of variables for the master brand', () => {
            assert.equal(masterBrandNodesByKind.variable.length, 4);
        });
    });

    describe('getNodes', () => {
        const masterBrandNodes = masterBrandSassDoc.getNodes();
        it('Did not return array for the master brand.', () => {
            assert.isTrue(Array.isArray(masterBrandNodes));
        });
        it('Returns the expected number of formatted mixin nodes for the master brand.', () => {
            assert.equal(masterBrandNodes.filter(node => node instanceof Mixin).length, 7);
        });
        it('Returns the expected number of formatted function nodes for the master brand.', () => {
            assert.equal(masterBrandNodes.filter(node => node instanceof Function).length, 2);
        });
        it('Returns the expected number of formatted variable nodes for the master brand.', () => {
            assert.equal(masterBrandNodes.filter(node => node instanceof Variable).length, 4);
        });

        const internalBrandNodes = internalBrandSassDoc.getNodes();
        it('Did not return array for the internal brand.', () => {
            assert.isTrue(Array.isArray(internalBrandNodes));
        });
        it('Returns the expected number of formatted mixin nodes for the internal brand.', () => {
            assert.equal(
                internalBrandNodes.filter(node => node instanceof Mixin).length,
                5,
                'Expected the internal brand to have fewer mixins than the master brand in this case.'
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
