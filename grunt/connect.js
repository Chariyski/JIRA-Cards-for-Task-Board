'use strict';

// Grunt server
module.exports = function (grunt, config) {
    return {
        options: {
            hostname: 'localhost'
        },
        dist: {
            options: {
                open: true,
                port: 9001,
                base: ['<%= dist %>']
            }
        }
    };
};
