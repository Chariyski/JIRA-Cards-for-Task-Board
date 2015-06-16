'use strict';

// Make sure code styles are up to par and there are no obvious mistakes
module.exports = function (grunt, config) {
    return {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        scripts: [
            '<%= app %>/scripts/**/*.js'
        ],
        gruntfiles: ['Gruntfile.js', '<%= grunt %>/*.js']
    };
};
