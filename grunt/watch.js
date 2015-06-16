'use strict';

// Watches files for changes and runs tasks based on the changed files
module.exports = function (grunt, config) {
    return {
        options: {
            spawn: false,
            interval: 5000
        },
        html: {
            files: ['<%= app %>/**/*.html'],
            tasks: ['vulcanize']
        },
        js: {
            files: ['<%= app %>/scripts/**/*.js'],
            tasks: ['newer:jshint:scripts']
        },
        gruntfiles: {
            files: ['Gruntfile.js', '<%= grunt %>/*.js'],
            tasks: ['jshint:gruntfiles']
        },
        styles: {
            files: ['<%= app %>/styles/less/**/*.less'],
            tasks: ['less']
        },
        manifest: {
            files: ['<%= app %>/manifest.json'],
            tasks: ['copy']
        }
    };
};
