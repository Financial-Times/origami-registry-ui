'use strict';

class SassDocNav {
    static createNavigation(sassDoc) {
        const nodesByType = sassDoc.getNodesByType();
        const navOrder = ['mixin', 'function', 'variable'];
        return Object.entries(nodesByType).sort(
            (a, b) => navOrder.indexOf(a[0]) < 0 || (navOrder.indexOf(a[0]) > navOrder.indexOf(b[0])) ? 1 : -1
        ).map(entry => {
            const type = entry[0];
            const nodes = entry[1];
            const title = `${type}s`;
            return {
                title: title.charAt(0).toUpperCase() + title.slice(1),
                items: nodes.map((node) => {
                    return {
                        title: node.context.name,
                        link: `#${node.group.join('-')}-${node.context.type}-${node.context.name}`
                    };
                })
            };
        });
    }
}

module.exports = SassDocNav;
