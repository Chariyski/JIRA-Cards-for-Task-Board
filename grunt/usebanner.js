'use strict';

module.exports = function (grunt, config) {
    return {
        copyrights: {
            options: {
                position: 'top',
                banner: '<!--\n' +
                '- This file is part of JIRA Cards for Task Board,\n' +
                '- Copyright (C) 2014-2015 Krasimir Chariyski\n' +
                '-\n' +
                '- JIRA Cards for Task Board is free software: you can redistribute it and/or modify\n' +
                '- it under the terms of the GNU General Public License version 3 as\n' +
                '- published by the Free Software Foundation.\n' +
                '-\n' +
                '- JIRA Cards for Task Board is distributed in the hope that it will be useful,\n' +
                '- but WITHOUT ANY WARRANTY; without even the implied warranty of\n' +
                '- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n' +
                '- GNU General Public License for more details.\n' +
                '-\n' +
                '- You should have received a copy of the GNU General Public License\n' +
                '- along with JIRA Cards for Task Board.  If not, see <http://www.gnu.org/licenses/>.\n' +
                '-->',
                linebreak: true
            },
            files: {
                src: ['<%= dist %>/**/*.*']
            }
        }
    };
};
