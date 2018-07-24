'use strict';

const ClassNode = require('./nodes/class');
const EventNode = require('./nodes/event');
const FunctionNode = require('./nodes/function');
const MixinNode = require('./nodes/mixins');
const NamespaceNode = require('./nodes/namespace');
const PropertyNode = require('./nodes/property');
const ModuleNode = require('./nodes/module');

/// Process JsDoc json for display within the registry.
class JsDoc {
    
    static supportedDoclets() {
        return ['class', 'function', 'constant', 'member', 'event', 'namespace', 'mixin', 'module'];
    }

    static formatDoclet(doclet) {
        switch (doclet.kind) {
            case 'class':
                return new ClassNode(doclet);
                break;
            case 'function':
                return new FunctionNode(doclet);
                break;
            case 'constant':
            case 'member':
                return new PropertyNode(doclet);
                break;
            case 'event':
                return new EventNode(doclet);
                break;
            case 'namespace':
                return new NamespaceNode(doclet);
                break;
            case 'mixin':
                return new MixinNode(doclet);
                break;
            case 'module':
                return new ModuleNode(doclet);
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