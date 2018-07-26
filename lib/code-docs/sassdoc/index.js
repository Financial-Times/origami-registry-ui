'use strict';

const sassDocExtras = require('sassdoc-extras');

class SassDoc {

    constructor(componentName, doclets) {
        this.doclets = doclets;
        this.groupNameAliases = {
            'undefined': componentName,
        };
    }

    getNodesByType() {
        return sassDocExtras.byType(this.getNodes());
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

            sassDocExtras.markdown(context);
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
            this._formattedDoclets = context.data;
        }
        return this._formattedDoclets;
    }
}

module.exports = SassDoc;
