'use strict';

module.exports = function (grunt, config) {
    return {
        dist: {
            options: {
                optimization: 2
            },
            files: [{
                expand: true,
                cwd: '<%= app %>/styles/less',
                dest: '<%= dist %>/styles',
                src: [
                    '*.less'
                ],
                ext: '.css'
            }]
        }
    };
};
