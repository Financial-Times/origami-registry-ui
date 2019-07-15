'use strict';
const showdown = require('showdown');

/**
 * @param {String|null} string
 * @return {String} - A capitalised sting.
 */
function capitalise(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

function ifEquals(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function ifAny(a, ...args) {
    const options = args.pop();
    if (args.includes(a)) {
        return options.fn(this);
    }

    return options.inverse(this);
}

function ifBoth(a, b, options) {
    if (a && b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function ifEither(a, b, options) {
    if (a || b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function unlessEquals(a, b, options) {
    if (a !== b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function slugify(value) {
    value = value || '';
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-\s]+/g, '')
        .replace(/\s+/g, '-');
}

function json(value) {
    return JSON.stringify(value);
}

function markdown(value, headerLevelStart = 1) {
    value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape HTML tags.
    const converter = new showdown.Converter({
        headerLevelStart,
        simplifiedAutoLink: true
    });
    return String.raw`${converter.makeHtml(value)}`;
}

function increment(value) {
    return parseInt(value) + 1;
};


module.exports = {
    capitalise,
    ifAny,
    ifBoth,
    ifEquals,
    ifEither,
    json,
    slugify,
    unlessEquals,
    markdown,
    increment
};
