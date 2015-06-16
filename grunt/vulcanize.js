'use strict';

module.exports = function (grunt, config) {
    return {
        default: {
            options: {
                csp: true,
                strip: false,
                excludes: {
                    imports: [
                        //do not use roboto import because it requires external server (imported trough screen.scss)
                        'roboto.html',

                        //do not use the following imports as they try to import scripts from it's bower location.
                        //(these get packaged in libs.js)
                        // TODO
                        //'polymer.html',
                    ]
                }
            },
            files: {
                '<%= dist %>/popup.html': '<%= app %>/popup.html'
            }
        }
    };
};
