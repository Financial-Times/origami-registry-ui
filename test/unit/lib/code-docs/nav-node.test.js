'use strict';

const assert = require('proclaim');
const NavNode = require('../../../../lib/code-docs/nav-node');

describe('lib/code-docs/nav-node', () => {
    it('creates a nav item with title and link', () => {
        const title = 'my title';
        const link = '#myLink';
        const testNavNode = new NavNode(title, link);
        assert.equal(testNavNode.link, link, 'Did not add link.');
        assert.equal(testNavNode.title, title, 'Did not add title.');
        assert.deepEqual(testNavNode.items, [], 'Did not create empty sub items array.');
    });
    it('creates a nav item with title, link, and sub items', () => {
        const title = 'my title';
        const link = '#myLink';
        const items = [
            new NavNode('item 1', '#item1'),
            new NavNode('item 2', '#item2')
        ];
        const testNavNode = new NavNode(title, link, items);
        assert.equal(testNavNode.link, link);
        assert.equal(testNavNode.title, title);
        assert.deepEqual(testNavNode.items, items);
    });
    it('creates a nav node with title and sub items, without a link', () => {
        const title = 'my title';
        const items = [
            new NavNode('item 1', '#item1'),
            new NavNode('item 2', '#item2')
        ];
        const testNavNode = new NavNode(title, items);
        assert.equal(testNavNode.title, title);
        assert.equal(testNavNode.items, items);
        assert.deepEqual(testNavNode.link, undefined);
    });

    describe('addItem', () => {
        it('adds a given sub item to a nav node with no existing items', () => {
            const title = 'my title';
            const link = '#myLink';
            const item = new NavNode('item 1', '#item1');
            const testNavNode = new NavNode(title, link);
            testNavNode.addItem(item);
            assert.deepEqual(testNavNode.items, [item]);
        });
        it('adds a given sub item to a nav node which already has items', () => {
            const title = 'my title';
            const item1 = new NavNode('item 1', '#item1');
            const item2 = new NavNode('item 2', '#item2');
            const testNavNode = new NavNode(title, [item1]);
            testNavNode.addItem(item2);
            assert.deepEqual(testNavNode.items, [item1, item2]);
        });
    });

    describe('getItems', () => {
        it('returns the sub items of a nav node', () => {
            const title = 'my title';
            const items = [
                new NavNode('item 1', '#item1'),
                new NavNode('item 2', '#item2')
            ];
            const testNavNode = new NavNode(title, items);
            assert.deepEqual(testNavNode.getItems(), items);
        });
    });

    describe('getLastItem', () => {
        it('returns the last items of a nav node', () => {
            const title = 'my title';
            const item1 = new NavNode('item 1', '#item1');
            const item2 = new NavNode('item 2', '#item2');
            const items = [
                item1,
                item2
            ];
            const testNavNode = new NavNode(title, items);
            assert.deepEqual(testNavNode.getLastItem(), item2);
        });
    });

    describe('hasItems', () => {
        it('returns false for a nav node with no sub items', () => {
            const title = 'my title';
            const link = '#myLink';
            const testNavNode = new NavNode(title, link);
            assert.strictEqual(testNavNode.hasItems(), false);
        });
        it('returns true for a nav node with no sub items', () => {
            const title = 'my title';
            const link = '#myLink';
            const items = [
                new NavNode('item 1', '#item1')
            ];
            const testNavNode = new NavNode(title, link, items);
            assert.strictEqual(testNavNode.hasItems(), true);
        });
    });
});
