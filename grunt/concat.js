'use strict';

module.exports = function (grunt, config) {
    return {
        options: {
            separator: ';'
        },
        dist: {
            src: ['<%= bower_components %>/webcomponentsjs/webcomponents-lite.min.js'],
            dest: '<%= app %>/scripts/libs.js'
        }
    };
};
