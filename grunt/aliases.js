'use strict';

/**
 * Grunt aliases
 * @type {Object}
 */
module.exports = {
    preprocess: [
        'jshint',
        'concat',
        'less',
        'vulcanize'
    ],
    dist: [
        'clean:dist',
        'preprocess',
        'copy'
    ],
    default: [
        'dist',
        'watch'
    ],
    build: [
        'dist',
        'chromeManifest:build',
        'usebanner'
    ]
};

