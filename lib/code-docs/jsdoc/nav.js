'use strict';

const JsDoc = require('./');

class JsDocNav {
    static createNavigation(doclets) {
        const nav = [];
        // Get supported and docmented nodes.
        doclets = JsDoc.filterDoclets(doclets);
        const nodes = JsDoc.formatDoclets(doclets);
        // Add important doclets to the root of the nav with subnavs.
        // E.g. add classes with funciton and proeprties as a subnav.
        const nodesByHierarchy = JsDoc.formatByHierarchy(doclets);
        const docletGroups = [
            { 'name': 'classes', 'subGroups': ['functions', 'properties'] },
            { 'name': 'modules', 'subGroups': ['classes', 'functions', 'properties'] }]; 
        docletGroups.forEach(docletGroup => {
            nodesByHierarchy[docletGroup.name].forEach((node) => {
                nav.push(createSubNav(
                    `${node.name}`,
                    [].concat([node], ...docletGroup.subGroups.map(name => node[name]))
                ));
            });
        });
        // Add events to nav, ignoring their hierarchy.
        // I.e. Surface events which are not in the global scope.
        const eventNodes = nodes.filter(node => node.kind === 'event');
        nav.push(createSubNav('Events', eventNodes));
        // Add global nodes which are not already added to the nav.
        const globalNodes = nodes.filter(node => node.memberof === undefined && ['class', 'module', 'events'].includes(node.kind) === false);
        nav.push(createSubNav('Global', globalNodes));
        return nav;
    }
}

function createSubNav(title, nodes) {
    nodes = nodes || [];
    const items = nodes.filter(node => node).map((node) => {
        let title = `${node.label}: ${node.name}`;
        if (node.kind === 'class' && node.memberof === undefined) {
            title = 'Constructor & Overview';
        }
        if (node.kind === 'module' && node.memberof === undefined) {
            title = 'Overview';    
        }
        if (node.kind === 'module' && node.memberof === undefined) {
            title = 'Overview';    
        }
        const item = {
            title,
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