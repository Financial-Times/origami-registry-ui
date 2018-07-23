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
        navNodes.events.push(memberEventNodes);

        // Create nav.
        return Object.entries(navNodes).reduce((nav, nodeGroup) => {
            const groupName = nodeGroup[0];
            const nodes = nodeGroup[1];
            nav.push(createSubNav(groupName, nodes));
        }, []);
    }
}

function createSubNav(title, nodes) {
    const items = nodes.map((node) => {
        const item = {
            title: node.name,
            link: `#${node.longname}`
        };
        // Add a subnav of funcitons to classes.
        if (node.kind === 'class' && node.functions.length > 0) {
            item.subnavs = [createSubNav('functions', node.functions)];
        }
        return item;
    });
    return {
        title,
        items
    };
}

module.exports = JsDocNav;