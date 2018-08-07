'use strict';

class NavNode {
    constructor(title, link = null, subItems = []) {
        subItems = arguments.length === 2 && Array.isArray(link) ? link : subItems;
        this.title = title;
        this.items = subItems;
        if (typeof(link) === 'string') {
            this.link = link;
        }
    }

    addItem(navNode) {
        this.items.push(navNode);
    }

    getItems() {
        return this.items;
    }

    getLastItem() {
        const lastIndex = this.items.length - 1;
        return this.items[lastIndex];
    }

    hasItems() {
        return Boolean(this.items.length);
    }
}

module.exports = NavNode;
