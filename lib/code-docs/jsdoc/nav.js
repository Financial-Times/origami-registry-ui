'use strict';

const JsDoc = require('./');

class JsDocNav {
    static createNavigation(doclets) {
        // Get nodes by hierarchy.
        doclets = JsDoc.filterDoclets(doclets);
        const nodesByHierarchy = JsDoc.formatByHierarchy(doclets);

        // Copy all events nodes to the root of the hierarchy.
        const navNodes = nodesByHierarchy;
        const nodes = JsDoc.formatDoclets(doclets);
        const memberEventNodes = nodes.filter(node => node.memberof !== undefined && node.kind === 'event');
        navNodes.events = navNodes.events || [];
        navNodes.events = navNodes.events.concat(memberEventNodes);

        // Create nav.
        return Object.entries(navNodes).reduce((nav, nodeGroup) => {
            const groupName = nodeGroup[0];
            const nodes = nodeGroup[1];
            const groupNameTitle = groupName.replace(/\b\w/g, l => l.toUpperCase());
            const subNav = createSubNav(groupNameTitle, nodes);
            if (groupName === 'classes') {
                nav.unshift(subNav);
            } else {
                nav.push(subNav);
            }
            return nav;
        }, []);
    }
}

function createSubNav(title, nodes) {
    nodes = nodes || [];
    const items = nodes.map((node) => {
        const item = {
            title: node.name,
            link: `#${node.longname}`
        };
        return item;
    });
    return {
        title,
        items
    };
}

module.exports = JsDocNav;