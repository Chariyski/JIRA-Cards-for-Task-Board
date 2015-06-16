'use strict';

module.exports = function (grunt, config) {
    return {
        build: {
            options: {
                buildnumber: '2.0.0',
                //background: {
                //    target: 'scripts/background/main.js'
                //}
            },
            src: '<%= app %>',
            dest: '<%= dist %>'
        }
    };
};
