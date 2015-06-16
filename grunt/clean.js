'use strict';

// Empties folders to start fresh
module.exports = function (grunt, config) {
    return {
        chrome: {},
        dist: {
            files: [{
                dot: true,
                src: [
                    '<%= dist %>/*'
                ]
            }]
        }
    };
};
