'use strict';

const NavNode = require('../nav-node');

class SassDocNav {
    static createNavigation(sassDoc) {
        const nodesByType = sassDoc.getNodesByKind();
        const navOrder = ['mixin', 'function', 'variable'];
        return Object.entries(nodesByType).sort(
            (a, b) => navOrder.indexOf(a[0]) < 0 || (navOrder.indexOf(a[0]) > navOrder.indexOf(b[0])) ? 1 : -1
        ).map(entry => {
            const type = entry[0];
            const nodes = entry[1];
            const title = `${type}s`;
            const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
            const items = nodes.map((node) => new NavNode(node.name, `#${node.longname}`));
            return new NavNode(
                formattedTitle,
                items
            );
        });
    }
}

module.exports = SassDocNav;
