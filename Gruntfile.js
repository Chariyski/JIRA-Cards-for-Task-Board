/*
 * Copyright TODO???????????
 */

'use strict';

module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {
        // data passed into config.  Can use with <%= *** %>
        data: {
            app: 'app',
            dist: 'dist',
            bower: 'bower_components',
            grunt: 'grunt'
        }
    });

};
