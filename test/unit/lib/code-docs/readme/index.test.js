'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('proclaim');
const Readme = require('../../../../../lib/code-docs/readme');

describe('lib/code-docs/readme/index', () => {
    const versionTag = 'v1.0.0';
    const githubUrl = 'https://github.com/Financial-Times/o-mock-component';

    describe('createNavigation', () => {
        const createNavReadme = new Readme('# H1\n## H2a\n### H3a\nSome actual content.\n## H2b\n## H2c\n#### H4a\n\n### H3b\n### H3c\n## H2d\nMore content.', versionTag, githubUrl);
        const nav = createNavReadme.createNavigation();
        it('creates nav nodes for level two headings', () => {
            assert.equal(nav.length, 4);
            nav.forEach((navItem) => {
                assert.isTrue(navItem.title.includes('H2'));
                assert.isTrue(navItem.link.includes('#h2'));
            });
        });
        it('creates sub navs on the level two headings for level three headings', () => {
            const firstHeadingLevelTwo = nav[0];
            assert.equal(firstHeadingLevelTwo.items[0].title, 'H3a');
            assert.equal(firstHeadingLevelTwo.items[0].link, '#h3a');
        });
    });
    describe('removeNav', () => {
        it('removes the first list of the readme which includes an item we expect from an Origami readme nav e.g. usage, migration, license', () => {
            const navReadme = new Readme('Copy before nav\n- [Usage](#usage)\n	- [Migration guide](#migration-guide)\n- [Contact](#contact)\n\nPost nav content.', versionTag, githubUrl);
            assert.notOk(navReadme.toString().includes('Usage'), `Found usage nav item in content: ${navReadme.toString()}`);
            assert.notOk(navReadme.toString().includes('Migration'), `Found migration nav item in content: ${navReadme.toString()}`);
            assert.notOk(navReadme.toString().includes('Contact'), `Found contact nav item in content: ${navReadme.toString()}`);
        });
    });
    describe('removeHeading', () => {
        it('removes the first h1 of the readme', () => {
            const headingReadme = new Readme('<h1>Heading Here</h1>\n\nPost heading content.', versionTag, githubUrl);
            assert.notOk(headingReadme.toString().includes('Heading'), `Found the heading in content: ${headingReadme.toString()}`);
            assert.ok(headingReadme.toString('Post heading content.'), `Did not find content following the heading: ${headingReadme.toString()}`);
        });
    });
    describe('formatCode', () => {
        it('formats code blocks for o-syntax-hightlight', () => {
            const codeReadme = new Readme('```js\nconst example = "hi"\n```', versionTag, githubUrl);
            assert.ok(codeReadme.toString().includes('<div data-o-component="o-syntax-highlight"><pre><code class="o-syntax-highlight--js">const example = &quot;hi&quot;</code></pre>'));
        });
        it('formats code blocks with space before the language declaration for o-syntax-hightlight', () => {
            const codeReadme = new Readme('```      scss\nbody: {background-color: hotpink;}\n```', versionTag, githubUrl);
            assert.ok(codeReadme.toString().includes('<div data-o-component="o-syntax-highlight"><pre><code class="o-syntax-highlight--scss">body: {background-color: hotpink;}</code></pre></div>'));
        });
        it('formats inline code blocks for o-syntax-hightlight', () => {
            const codeReadme = new Readme('`obt install`', versionTag, githubUrl);
            assert.ok(codeReadme.toString().includes('<span data-o-component="o-syntax-highlight"><code>obt install</code></span>'));
        });
    });
    describe('formatTables', () => {
        it('formats tables for o-table "responsive scroll"', () => {
            const codeReadme = new Readme('| example | number |\n|---------|--------|\n| 1       | one    |\n| 2       | two    |\n', versionTag, githubUrl);
            assert.ok(codeReadme.toString().includes('<div class="o-table-container"><div class="o-table-overlay-wrapper"><div class="o-table-scroll-wrapper"><table class="o-table o-table--horizontal-lines o-table--responsive-overflow" data-o-component="o-table" data-o-table-responsive="overflow">'));
        });
    });
    describe('formatAnchors', () => {
        it('formats in-page anchor links as Origami style links', () => {
            const anchorReadme = new Readme('[anchor link](#myanchor)', versionTag, githubUrl);
            assert.ok(anchorReadme.toString().includes('<a href="#myanchor" class="link">anchor link</a>'));
        });
        it('updates href of relative urls to point to GitHub', () => {
            const anchorReadme = new Readme('[relative link](/relative/link)', versionTag, githubUrl);
            assert.ok(anchorReadme.toString().includes('<a href="https://github.com/Financial-Times/o-mock-component/blob/v1.0.0//relative/link" class="link-external">relative link</a>'));
        });
        it('formats absolute anchors as Origami style external links', () => {
            const anchorReadme = new Readme('[relative link](https://google.com)', versionTag, githubUrl);
            assert.ok(anchorReadme.toString().includes('<a href="https://google.com" class="link-external">relative link</a>'));
        });
        it('formats absolute anchors as Origami style internal links if the current host matches', () => {
            const anchorReadme = new Readme('[internal link](https://localhost.com)', versionTag, githubUrl, 'localhost.com');
            assert.ok(anchorReadme.toString().includes('<a href="https://localhost.com" class="link">internal link</a>'));
        });
        it('does not format anchors which contain an image e.g. the circle ci build image ', () => {
            const anchorReadme = new Readme('[![CircleCI](https://circleci.com/gh/Financial-Times/o-test-component.png)](https://circleci.com/gh/Financial-Times/o-test-component)', versionTag, githubUrl);
            assert.ok(anchorReadme.toString().includes('<a href="https://circleci.com/gh/Financial-Times/o-test-component">')); // no link class
        });
    });
    describe('toString', () => {
        const readmeMarkdown = fs.readFileSync(path.resolve(__dirname, '../../../mock/code-docs/readme/readme.md'));
        const testReadme = new Readme(readmeMarkdown.toString(), versionTag, githubUrl);
        it('outputs readme as html', () => {
            assert.equal(testReadme.toString(), '<html><head></head><body>\n<p>FT-branded styles for test elements.</p>\n\n<h2 id="usage">Usage</h2>\n<h3 id="markup">Markup</h3>\n<p>Add content to <span data-o-component="o-syntax-highlight"><code>o-test-component</code></span>:</p>\n<div data-o-component="o-syntax-highlight"><pre><code class="o-syntax-highlight--html">&lt;div class=&quot;o-test-component&quot; data-o-component=&quot;o-test-component&quot;&gt;\n    &lt;!-- My content --&gt;\n&lt;/div&gt;</code></pre></div>\n<p>For an example see the <a href="https://www.ft.com/__origami/service/build/v2/demos/o-test-component/" class="link-external">registry demos</a>.</p>\n<h3 id="sass">Sass</h3>\n<h4 id="silent-mode">Silent mode</h4>\n<p>In silent mode <span data-o-component="o-syntax-highlight"><code>o-test-component</code></span> provides mixins for each part of the test component.</p>\n<p>The <span data-o-component="o-syntax-highlight"><code>oTestComponent</code></span> mixin will output all features of <span data-o-component="o-syntax-highlight"><code>o-test-component</code></span>. Turn off silent mode to output all <span data-o-component="o-syntax-highlight"><code>o-test-component</code></span> features using this mixin automatically.</p>\n<div data-o-component="o-syntax-highlight"><pre><code class="o-syntax-highlight--scss">$o-test-component-is-silent: false;\n@import &apos;o-test-component/main&apos;;</code></pre></div>\n<h4 id="mixins">Mixins</h4>\n<p>If your project does not need all <span data-o-component="o-syntax-highlight"><code>o-test-component</code></span> features, you may reduce your project&apos;s CSS bundle size by using the following mixins to only output what you need.</p>\n<h3 id="javascript">JavaScript</h3>\n<p><span data-o-component="o-syntax-highlight"><code>o-test-component</code></span> provides some JavaScript to make things even better.</p>\n<h2 id="troubleshooting">Troubleshooting:</h2>\n<ul>\n<li>Turn it off and on again?</li>\n</ul>\n<hr>\n<h2 id="migration-guide">Migration Guide</h2>\n<h2 id="upgrading-from-v1xx-to-v2xx">Upgrading from v1.x.x to v2.x.x</h2>\n<div data-o-component="o-syntax-highlight"><pre><code class="o-syntax-highlight--diff">-&lt;div class=&quot;o-test-component-original&quot;&gt;\n+&lt;div class=&quot;o-test-component&quot;&gt;</code></pre></div>\n<h2 id="contact">Contact</h2>\n<p>If you have any questions or comments about this component, or need help using it, please either <a href="https://github.com/Financial-Times/o-test-component/issues" class="link-external">raise an issue</a>, visit <a href="https://financialtimes.slack.com/messages/ft-origami/" class="link-external">#ft-origami</a> or email <a href="mailto:origami-support@ft.com" class="link-external">Origami Support</a>.</p>\n<h2 id="licence">Licence</h2>\n<p>This software is published by the Financial Times under the <a href="http://opensource.org/licenses/MIT" class="link-external">MIT licence</a>.</p></body></html>');
        });
    });
});
