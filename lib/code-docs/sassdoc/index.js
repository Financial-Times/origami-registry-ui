'use strict';

const sassDocExtras = require('sassdoc-extras');
const Mixin = require('./nodes/mixin');

class SassDoc {

    constructor(componentName, doclets) {
        this.doclets = doclets;
        this.groupNameAliases = {
            'undefined': componentName,
        };
    }

    getNodesByKind() {
        return this.getNodes().filter(item => item.kind).reduce((nodeByKind, item) => {
            nodeByKind[item.kind] = nodeByKind[item.kind] || [];
            nodeByKind[item.kind].push(item);
            return nodeByKind;
        }, {});
    }

    getNodes() {
        if (! this._formattedDoclets) {
            // Apply default values for groups and display.
            const context = {
                display: {
                    access: ['public'],
                },
                groups: this.groupNameAliases,
                data: this.doclets
            };

            // Remove any non-public doclets (configured above by the 'display' property).
            // http://sassdoc.com/extra-tools/#display-toggle-display
            sassDocExtras.display(context);
            // Customise @group names (configured above by the 'groups' above).
            // http://sassdoc.com/extra-tools/#groups-aliases-groupname
            sassDocExtras.groupName(context);
            // Remove placeholders. These cause Origami users issues.
            // If used at all placeholders should be internal to Origami only.
            // https://github.com/Financial-Times/ft-origami/issues/205
            // https://github.com/Financial-Times/ft-origami/issues/293
            context.data = context.data.filter(doclet => doclet.context.type !== 'placeholder');
            // Format data for registry use.
            context.data = context.data.map((doclet) => {
                if (doclet.context.type === 'mixin') {
                    return new Mixin(doclet);
                }
                return doclet;
            });
            this._formattedDoclets = context.data;
        }
        return this._formattedDoclets;
    }
}

module.exports = SassDoc;
