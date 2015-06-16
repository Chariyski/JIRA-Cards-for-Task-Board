'use strict';

// Copies remaining files
module.exports = function (grunt, config) {
    return {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= app %>',
                dest: '<%= dist %>',
                src: [
                    'images/**/*.*',
                    'manifest.json',
                    'scripts/**/*.*'
                ]
            }]
        }
    };
};
