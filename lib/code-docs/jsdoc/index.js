'use strict';

const createClassNode = require('./nodes/class');
const createEventNode = require('./nodes/event');
const createFunctionNode = require('./nodes/function');
const createMixinNode = require('./nodes/mixins');
const createNamespaceNode = require('./nodes/namespace');
const createPropertyNode = require('./nodes/property');
const createModuleNode = require('./nodes/module');

/// Process JsDoc json for display within the registry.
class JsDoc {
    
    static supportedDoclets() {
        return ['class', 'function', 'constant', 'member', 'event', 'namespace', 'mixin', 'module'];
    }

    static formatDoclet(doclet) {
        switch (doclet.kind) {
            case 'class':
                return createClassNode(doclet);
                break;
            case 'function':
                return createFunctionNode(doclet);
                break;
            case 'constant':
            case 'member':
                return createPropertyNode(doclet);
                break;
            case 'event':
                return createEventNode(doclet);
                break;
            case 'namespace':
                return createNamespaceNode(doclet);
                break;
            case 'mixin':
                return createMixinNode(doclet);
                break;
            case 'module':
                return createModuleNode(doclet);
                break;
            default:
                throw new Error(`JsDoc doclet kind "${doclet.kind}" is not supported by the registry.`);
                break;
        };
    }

    static filterDoclets(doclets) {
        return doclets.filter((doclet) => {
            const isSupported = doclet.kind && JsDoc.supportedDoclets().includes(doclet.kind);
            const isPublic = doclet.access !== 'private';
            const isDocumented = doclet.undocumented !== true;
            return isSupported && isPublic && isDocumented;
        });
    }

    static formatDoclets(doclets) {
        return doclets.map((doclet) => {
            return JsDoc.formatDoclet(doclet);
        });
    }

    static formatByHierarchy(doclets, parentNode = {}) {
        doclets = JsDoc.filterDoclets(doclets);
        const nodes = JsDoc.formatDoclets(doclets)
            .filter((node) => node.memberof === parentNode.longname);
        return nodes.reduce((parentNode, node) => {
            JsDoc.formatByHierarchy(doclets, node);
            parentNode[node.group] = parentNode[node.group] || [];
            parentNode[node.group].push(node);
            return parentNode;
        }, parentNode);
    }
}

module.exports = JsDoc;