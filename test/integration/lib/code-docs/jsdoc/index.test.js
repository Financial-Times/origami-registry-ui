/* global agent */
'use strict';

const assert = require('proclaim');
const JsDoc = require('../../../../../lib/code-docs/jsdoc');
const jsDocExampledata = require('../../../test/jsdoc.json'); //@todo replace with real data

describe('lib/code-docs/jsdoc/index', () => {

    const testJsDoc = new JsDoc(jsDocExampledata);

    describe('supportedDoclets', () => {
        it('Returns supported doclet kinds as an array', () => {
            assert.assert(Array.isArray(testJsDoc.supportedDoclets()), true, 'Did not return an array.');
            assert.assert(testJsDoc.supportedDoclets().includes('class'), true, 'Expected at least class doclets to be supported.');
        });
    });

});
