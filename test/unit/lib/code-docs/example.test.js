'use strict';

const assert = require('proclaim');
const Example = require('../../../../lib/code-docs/example');

describe('lib/code-docs/example', () => {
    const code = `
            <h1>HTML</h1>
            <p>Code example!</p>
    `;
    const type = 'html';
    const caption = 'My HTML example.';

    it('creates an example with just code', () => {
        const example = new Example(code);
        assert.equal(example.code, code, 'Did not add code.');
        assert.equal(example.type, '', 'Did not add empty type.');
        assert.equal(example.caption, '', 'Did not add empty caption.');
    });
    it('creates an example with a type', () => {
        const example = new Example(code, type);
        assert.equal(example.type, type, 'Did not add type.');
    });
    it('creates an example with a caption, enforcing a newline to render as a paragraph via markdown', () => {
        const example = new Example(code, null, caption);
        assert.include(example.caption, caption, 'Did not add the caption.');
        assert.include(example.caption, '\n', 'Did not enforce newline on the caption.');
    });
    it('creates an example with code, a type, and a caption', () => {
        const example = new Example(code, type, caption);
        assert.equal(example.code, code, 'Did not add code.');
        assert.equal(example.type, type, 'Did not add type.');
        assert.include(example.caption, caption, 'Did not add the caption.');
    });
});
