'use strict';

module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'ie >= 11',
        'ff ESR',
        'safari >= 9'
      ],
      cascade: false,
      flexbox: 'no-2009',
      grid: true
    },
    cssnano: {
      // Trims whitespace inside and around rules, selectors & declarations, plus removes the final semicolon inside every selector.
      // Turn this on to improve minified css size.
      core: true,
      // Disable advanced optimisations that are not always safe.
      // This disables custom identifier reduction, z-index rebasing,
      // unused at- rule removal & conversion between absolute length values.
      safe: true
    }
  }
};
