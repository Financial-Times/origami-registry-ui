'use strict';

const showdown = require('showdown');
const cheerio = require('cheerio');
const NavNode = require('../nav-node');
const { URL } = require('url');

class ReadMe {

    constructor(markdown) {
        const converter = new showdown.Converter({ simplifiedAutoLink: true });
        converter.setFlavor('github');
        this.html = converter.makeHtml(markdown);
        this.markdown = markdown;
        this.removeNav();
        this.formatCode();
        this.formatTables();
        this.formatAnchors();
    }

    toString() {
        return this.html;
    }

    createNavigation() {
        const $ = cheerio.load(this.html);
        const rootNavNode = new NavNode('Readme');
        $('h2, h3').each((index, element) => {
            const link = `#${$(element).attr('id')}`;
            const title = $(element).text();
            if ($(element).is('h2')) {
                // Add h2 nav element to root nav element.
                rootNavNode.addItem(new NavNode(title, link));
            } else if (rootNavNode.hasItems()) {
                // Add h3 nav element to previous h2 nav element.
                rootNavNode.getLastItem().addItem(new NavNode(title, link));
            }
        });
        return [rootNavNode];
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
        });
        $('pre').wrap($('<div data-o-component="o-syntax-highlight"></div>'));
        this.html = $.html();
    }

    formatTables() {
        const $ = cheerio.load(this.html);
        $('table').addClass('o-table o-table--responsive-scroll').wrap($('<div class="o-table-wrapper"></div>'));
        this.html = $.html();
    }

    formatAnchors(currentHost) {
        const $ = cheerio.load(this.html);
        $('a').not((index, element) => $(element).has('img').length > 0).each(function () {
            try {
                const url = new URL($(this).attr('href'));
                $(this).addClass(url.hostname === currentHost ? 'link' : 'link-external');
            } catch (error) {
                $(this).addClass('link');
            }
        });
        this.html = $.html();
    }
}

module.exports = ReadMe;
