'use strict';

const ClassNode = require('./nodes/class');
const EventNode = require('./nodes/event');
const FunctionNode = require('./nodes/function');
const MixinNode = require('./nodes/mixin');
const NamespaceNode = require('./nodes/namespace');
const PropertyNode = require('./nodes/property');
const ModuleNode = require('./nodes/module');

/**
 * Methods to prepare JsDoc json doclets for display within the registry.
 */
class JsDoc {
    /**
     * @param {Object[]} doclets - Raw json doclets generated by JSDoc.
     */
    constructor(doclets) {
        this.doclets = doclets;
    }

    /**
     * @returns {string[]} Kinds of JSDoc doclets which are supported.
     */
    static supportedDoclets() {
        return ['class', 'function', 'constant', 'member', 'event', 'namespace', 'mixin', 'module'];
    }

    /**
     * Format a doclet by removing superfluous properties and adding any custom properties.
     * @param {Object} doclet - A raw json doclet generated by JSDoc.
     * @returns {Object} Formatted node.
     */
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

    /**
     * @returns {Object[]} Formatted nodes.
     */
    getNodes() {
        if (!this._formattedDoclets) {
            const supportedDoclets = this.doclets.filter((doclet) => {
                const isNotIndicatedPrivate = doclet.name && doclet.name.indexOf('_') !== 0;
                const isSupported = doclet.kind && JsDoc.supportedDoclets().includes(doclet.kind);
                const isPublic = doclet.access !== 'private';
                const isDocumented = doclet.undocumented !== true;
                return isSupported && isPublic && isNotIndicatedPrivate && isDocumented;
            });

            this._formattedDoclets = supportedDoclets.map((doclet) => {
                return JsDoc.formatDoclet(doclet);
            });
        }
        return this._formattedDoclets;
    }

    /**
     * @returns {Object[]} Formatted nodes.
     */
    getNodesByTypeWithMembers() {
        if (!this._formattedDocletsWithMembers) {
            this._formattedDocletsWithMembers = JsDoc._addChildNodes(this.getNodes(), {});
        }
        return this._formattedDocletsWithMembers;
    }

    /**
     * Add member nodes to parent nodes. E.g. add function nodes to their corresponding class node.
     * @param {Object[]} nodes [{}] - Formatted JSDoc doclets.
     * @param {Object|Object[]} parentNodes - Root nodes to add member nodes to (optional).
     * @returns {Object[]} Nodes with member nodes grouped by kind e.g. {name: 'Example', type: class, examples: [{}], functions: [{}], properties: [{}]}
     * @access private
     */
    static _addChildNodes(nodes, parentNodes = {}) {
        parentNodes = Array.isArray(parentNodes) ? parentNodes : [parentNodes];
        const nodesWithMembers = parentNodes.map((parentNode) => {
            const memberNodes = nodes.filter((node) => node.memberof === parentNode.longname);
            return memberNodes.reduce((parentNode, node) => {
                JsDoc._addChildNodes(nodes, node);
                parentNode[node.group] = parentNode[node.group] || [];
                parentNode[node.group].push(node);
                return parentNode;
            }, parentNode);
        });
        return (nodesWithMembers.length === 1 ? nodesWithMembers[0] : nodesWithMembers);
    }
}

module.exports = JsDoc;