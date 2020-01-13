'use strict';

const assert = require('proclaim');
const JsDoc = require('../../../../../lib/code-docs/jsdoc');
const ClassNode = require('../../../../../lib/code-docs/jsdoc/nodes/class');
const FunctionNode = require('../../../../../lib/code-docs/jsdoc/nodes/function');
const PropertyNode = require('../../../../../lib/code-docs/jsdoc/nodes/property');
const EventNode = require('../../../../../lib/code-docs/jsdoc/nodes/event');
const NamespaceNode = require('../../../../../lib/code-docs/jsdoc/nodes/namespace');
const MixinNode = require('../../../../../lib/code-docs/jsdoc/nodes/mixin');
const ModuleNode = require('../../../../../lib/code-docs/jsdoc/nodes/module');
const ClassDoclet = require('../../../mock/code-docs/jsdoc/class');
const FunctionDoclet = require('../../../mock/code-docs/jsdoc/function');
const EventDoclet = require('../../../mock/code-docs/jsdoc/event');
const PropertyDoclet = require('../../../mock/code-docs/jsdoc/property');
const NamespaceDoclet = require('../../../mock/code-docs/jsdoc/namespace');
const MixinDoclet = require('../../../mock/code-docs/jsdoc/mixin');
const ModuleDoclet = require('../../../mock/code-docs/jsdoc/module');
const TypeDef = require('../../../mock/code-docs/jsdoc/typedef');

describe('lib/code-docs/jsdoc/index', () => {

    describe('supportedDocletKinds', () => {
        it('Returns an array of supported doclet kinds', () => {
            assert.isTrue(Array.isArray(JsDoc.supportedDocletKinds()), 'Did not return an array.');
            assert.isTrue(JsDoc.supportedDocletKinds().includes('class'), 'Expected at least class doclets to be supported.');
        });
    });

    describe('supportedDoclet', () => {
        let testDoclet = {};
        beforeEach(() => {
            testDoclet = {
                'kind': 'function',
                'name': 'helloWorld',
                'longname': 'helloWorld',
            };
        });
        it('undocumented doclet returns false', () => {
            const undocumentedDoclet = testDoclet;
            undocumentedDoclet.undocumented = true;
            assert.isFalse(JsDoc.supportedDoclet(undocumentedDoclet));
        });
        it('unsupported doclet kind returns false', () => {
            const unsuportedKindDoclet = testDoclet;
            unsuportedKindDoclet.kind = 'notarealkind';
            assert.isFalse(JsDoc.supportedDoclet(unsuportedKindDoclet));
        });
        it('private doclet returns false', () => {
            const privateDoclet = testDoclet;
            privateDoclet.access = 'private';
            assert.isFalse(JsDoc.supportedDoclet(privateDoclet));
        });
        it('pseudo private doclet (where the name starts with an underscore) returns false', () => {
            const pseudoPrivateDoclet = testDoclet;
            pseudoPrivateDoclet.name = `_${pseudoPrivateDoclet.name}`;
            pseudoPrivateDoclet.longname = `_${pseudoPrivateDoclet.longname}`;
            assert.isFalse(JsDoc.supportedDoclet(pseudoPrivateDoclet));
        });
        it('documented, supported, public doclet returns true', () => {
            assert.isTrue(JsDoc.supportedDoclet(testDoclet));
        });
    });

    describe('getNodes', () => {
        let testDoclet = {};
        beforeEach(() => {
            testDoclet = {
                'kind': 'function',
                'name': 'helloWorld',
                'longname': 'helloWorld',
            };
        });
        it('Removes undocumented doclets', () => {
            const undocumentedDoclet = testDoclet;
            undocumentedDoclet.undocumented = true;
            assert.deepEqual(new JsDoc([undocumentedDoclet]).getNodes(), [], 'Did not remove undocumented doclet.');
        });
        it('Removes unsupported doclet kinds', () => {
            const unsuportedKindDoclet = testDoclet;
            unsuportedKindDoclet.kind = 'notarealkind';
            assert.deepEqual(new JsDoc([unsuportedKindDoclet]).getNodes(), [], 'Did not remove a doclet of an unsupported kind.');
        });
        it('Removes doclets marked private', () => {
            const privateDoclet = testDoclet;
            privateDoclet.access = 'private';
            assert.deepEqual(new JsDoc([privateDoclet]).getNodes(), [], 'Did not remove a private doclet.');
        });
        it('Removes pseudo private doclets (where the name starts with an underscore)', () => {
            const pseudoPrivateDoclet = testDoclet;
            pseudoPrivateDoclet.name = `_${pseudoPrivateDoclet.name}`;
            pseudoPrivateDoclet.longname = `_${pseudoPrivateDoclet.longname}`;
            assert.deepEqual(new JsDoc([pseudoPrivateDoclet]).getNodes(), [], 'Did not remove a pseudo private doclet.');
        });
        it('Does not remove a documented, supported, public doclet', () => {
            assert.ok(new JsDoc([testDoclet]).getNodes()[0], 'Removed supported doclet.');
        });
        it('Formats doclets', () => {
            const testJsDoc = new JsDoc([
                ClassDoclet.classDeclarationDoclet,
                FunctionDoclet.globalFunctionDoclet,
            ]);
            const nodes = testJsDoc.getNodes();
            assert.isTrue(Array.isArray(nodes), 'Did not return an array containing formatted nodes.');
            assert.ok(nodes.find(node => node instanceof ClassNode),'Did not format the class node.');
            assert.ok(nodes.find(node => node instanceof FunctionNode),'Did not format the function node.');
        });
    });

    describe('getNodesByTypeWithMembers', () => {
        const classDoclet = {
            'kind': 'class',
            'name': 'World',
            'longname': 'World',
        };
        const memberFunctionDoclet = {
            'kind': 'function',
            'name': 'hello',
            'longname': 'World#hello',
            'memberof': 'World',
        };
        const testJsDoc = new JsDoc([
            classDoclet,
            memberFunctionDoclet,
        ]);
        const nodes = testJsDoc.getNodesByTypeWithMembers();
        assert.isTrue(nodes.classes[0] instanceof ClassNode, 'Did not return an object with a classes property containing the formatted class node.');
        assert.ok(nodes.classes[0].functions.find(node => node instanceof FunctionNode), 'Did not format the function node as a member of the class node as expected.');
    });

    describe('formatDoclet', () => {
        const testJsDoc = new JsDoc([]);
        it('Adds custom "types" property to doclet parameters which have a typedef.', () => {
            const functionDoclet = TypeDef.classWithTypeDefinitionParam;
            const typedefDoclet = TypeDef.typeDefinition;
            const node = (new JsDoc([typedefDoclet, functionDoclet])).formatDoclet(functionDoclet);
            assert.deepEqual(node.constructor.parameters, [{
                name: 'rootEl',
                types: [{ name: 'HTMLElement', longname: null }], // HTMLElement is a built in type, it does not have a doclet.
                description: 'An o-component element.',
                default: '',
                optional: '',
                nullable: ''
            },
            {
                name: 'opts',
                types: [{ name: 'OComponent~opts', longname: 'OComponent~opts' }], // longname has been added to link opts type with its typedef doclet.
                description: 'An options object.',
                default: '',
                optional: '',
                nullable: ''
            }]);
        });
        it('Formats a class doclet', () => {
            const doclet = ClassDoclet.classDeclarationDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof ClassNode, 'Did not create a class node from a class doclet.');
        });
        it('Formats a function doclet', () => {
            const doclet = FunctionDoclet.globalFunctionDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof FunctionNode, 'Did not create a function node from a function doclet.');
        });
        it('Formats a member doclet', () => {
            const doclet = PropertyDoclet.memberDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof PropertyNode, 'Did not create a property node from a member doclet.');
        });
        it('Formats a constant doclet', () => {
            const doclet = PropertyDoclet.constantDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof PropertyNode, 'Did not create a property node from a constant doclet.');
        });
        it('Formats an event doclet', () => {
            const doclet = EventDoclet.eventDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof EventNode, 'Did not create a event node from a event doclet.');
        });
        it('Formats a namespace doclet', () => {
            const doclet = NamespaceDoclet.namespaceDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof NamespaceNode, 'Did not create a namespace node from a namespace doclet.');
        });
        it('Formats a mixin doclet', () => {
            const doclet = MixinDoclet.mixinDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof MixinNode, 'Did not create a mixin node from a mixin doclet.');
        });
        it('Formats a module doclet', () => {
            const doclet = ModuleDoclet.moduleDoclet;
            const node = testJsDoc.formatDoclet(doclet);
            assert.isTrue(node instanceof ModuleNode, 'Did not create a module node from a module doclet.');
        });
        it('Throws an error for an unsupported doclet kind', () => {
            const doclet = {
                kind: 'somethingunknown'
            };
            const formatDoclet = testJsDoc.formatDoclet.bind(null, doclet);
            assert.throws(formatDoclet, null, 'Should throw an error for an unsupported doclet kind.');
        });
    });

});
