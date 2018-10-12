'use strict';

class Example {
    constructor(code, type = '', caption = '') {
        this.caption = caption ? `${caption}\n` : ''; // newline to render as <p> with markdown
        this.type = type || '';
        this.code = code;
    }
}

module.exports = Example;
