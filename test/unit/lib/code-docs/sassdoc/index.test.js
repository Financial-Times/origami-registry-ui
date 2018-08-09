'use strict';

const assert = require('proclaim');
const SassDoc = require('../../../../../lib/code-docs/sassdoc');

describe('lib/code-docs/sassdoc/index', () => {

    describe('supportedDoclets', () => {
        it('Returns an array of supported doclet kinds', () => {
            assert.isTrue(Array.isArray(SassDoc.supportedDoclets()), 'Did not return an array.');
            assert.isTrue(SassDoc.supportedDoclets().includes('mixin'), 'Expected at least mixin doclets to be supported.');
        });
    });

    describe('getNodes', () => {
        const componentName = 'o-example';
        const brand = 'master';
        let doclet = {};

        beforeEach(() => {
            doclet = {
                'description': '',
                'context': {
                    'type': 'function',
                    'name': 'oTestComponentDouble',
                },
                'group': [],
                'access': 'public'
            };
        });

        it('removes doclets which do not have an access property', () => {
            delete doclet.access;
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes doclets which do not have a public access property', () => {
            doclet.access = 'private';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes doclets which are implicity private (name with underscore), ignoring the access property', () => {
            doclet.context.name = '_oTestComponentDouble';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes placeholder doclets', () => {
            doclet.context.type = 'placeholder';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('removes unsupported doclets', () => {
            doclet.context.type = 'notsupportedmadeup';
            assert.deepEqual(new SassDoc(componentName, brand, [doclet]).getNodes(), []);
        });
        it('does not remove supported, public doclets which are for the current brand', () => {
            assert.ok(new SassDoc(componentName, brand, [doclet]).getNodes()[0]);
        });
    });
});
