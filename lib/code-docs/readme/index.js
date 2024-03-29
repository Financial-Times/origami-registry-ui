'use strict';

const showdown = require('showdown');
const cheerio = require('cheerio');
const NavNode = require('../nav-node');
const { URL } = require('url');

class ReadMe {

    constructor(markdown, component, currentHost = undefined) {
        const converter = new showdown.Converter({ simplifiedAutoLink: true });
        converter.setFlavor('github');
        this.html = converter.makeHtml(markdown);
        this.markdown = markdown;
        this.removeHeading();
        this.removeNav();
        this.formatCode();
        this.formatTables();
        if(component.origamiVersion === '2.0') {
            this.formatAnchors(`https://github.com/Financial-Times/origami/tree/${component.name}-v${component.version}/components/${component.name}`, currentHost);
        } else {
            this.formatAnchors(`${component.url}/blob/${component.versionTag}`, currentHost);
        }
    }

    toString() {
        return this.html;
    }

    createNavigation() {
        const $ = cheerio.load(this.html);
        const nav = [];
        $('h2, h3').each((index, element) => {
            const link = `#${$(element).attr('id')}`;
            const title = $(element).text();
            if ($(element).is('h2')) {
                // Add h2 nav element to root nav element.
                nav.push(new NavNode(title, link));
            } else if (nav.length > 0) {
                // Add h3 nav element to previous h2 nav element.
                nav[nav.length - 1].addItem(new NavNode(title, link));
            }
        });
        return nav;
    }

    removeNav() {
        const $ = cheerio.load(this.html);
        const nav = $('ul').first();
        const listHtml = nav && nav.html() ? nav.html().toLowerCase() : '';
        // Assume the list we found is a nav if it contains a link we expect.
        if (listHtml.indexOf('usage') || listHtml.indexOf('javascript') || listHtml.indexOf('sass')) {
            nav.remove();
        }
        this.html = $.html();
    }

    removeHeading() {
        const $ = cheerio.load(this.html);
        const heading = $('h1').first();
        heading.remove();
        this.html = $.html();
    }

    formatCode() {
        const $ = cheerio.load(this.html);
        $('code').each(function () {
            const language = $(this).attr('class') ? $(this).attr('class').match('language-([a-z]*)')[1] : null;
            if (language) {
                const newLanguage = language === 'sass' ? 'scss' : language;
                $(this).removeClass(`language-${language}`);
                $(this).removeClass(language);
                $(this).addClass(`o-syntax-highlight--${newLanguage}`);
            }
            const preTag = $(this).parent('pre');
            if (preTag.length) {
                preTag.wrap($('<div data-o-component="o-syntax-highlight"></div>'));
            } else {
                $(this).wrap($('<span data-o-component="o-syntax-highlight"></span>'));
            }
        });
        this.html = $.html();
    }

    formatTables() {
        const $ = cheerio.load(this.html);
        $('table')
            .addClass('o-table o-table--horizontal-lines o-table--responsive-overflow')
            .attr('data-o-component', 'o-table')
            .attr('data-o-table-responsive', 'overflow')
            .wrap($('<div class="o-table-container"><div class="o-table-overlay-wrapper"><div class="o-table-scroll-wrapper"></div></div></div>'));
        this.html = $.html();
    }

    formatAnchors(relativeUrlBase, currentHost) {
        const $ = cheerio.load(this.html);
        $('a').filter((index, element) => {
            return $(element).has('img').length === 0 && $(element).attr('href');
        }).each(function () {
            const href = $(this).attr('href');
            try {
                const url = new URL(href);
                $(this).addClass(url.hostname === currentHost ? 'link' : 'link-external');
            } catch (error) {
                const inPageLink = href.match(/^#./g);
                if (inPageLink) {
                    $(this).addClass('link');
                } else {
                    $(this).attr('href', `${relativeUrlBase}/${href}`);
                    $(this).addClass('link-external');
                }
            }
        });
        this.html = $.html();
    }
}

module.exports = ReadMe;
