/*
 * This file is part of JIRA Cards for Task Board,
 * Copyright (C) 2014-2015 Krasimir Chariyski
 *
 * JIRA Cards for Task Board is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * JIRA Cards for Task Board is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JIRA Cards for Task Board.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
    'use strict';

    /**
     * AJAX request to JIRA server
     * @param url {String} REST url
     * @returns {Promise}
     */
    function getFromJIRA(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    // If successful, resolve the promise by passing back the request response
                    resolve(JSON.parse(request.responseText));
                } else {
                    // If it fails, reject the promise with a error message
                    reject(Error('Error status: ' + request.statusText));
                }
            };

            request.open('GET', window.location.protocol + '//' + window.location.host + url, true);
            request.send();
        });
    }

    /**
     * Send a message containing the page details back to the event page
     * @param data {Object} the response from the JIRA server
     */
    function sendToEventPage(data) {
        chrome.runtime.sendMessage(data);
    }

    // Perform the callback when a message is received from the event page
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // AJAX request for all project
        if (request.action === 'getProjects') {
            getFromJIRA('/rest/api/2/project/').then(function (response) {
                sendToEventPage(response);
            }, function (Error) {
                sendToEventPage(Error.message);
            });
        }

        // AJAX request for all version of the given project
        if (request.action === 'getVersion') {
            getFromJIRA('/rest/api/2/project/' + request.project + '/versions').then(function (response) {
                sendToEventPage(response);
            }, function (Error) {
                sendToEventPage(Error.message);
            });
        }

        // AJAX request for all issue from the given project and version
        if (request.action === 'getIssues') {

            if (request.version !== 'default') {
                getFromJIRA('/rest/api/2/search?jql=project=' + request.project + '+and+fixVersion=' + request.version + '&&maxResults=500').then(function (response) {
                    sendToEventPage(response);
                }, function (Error) {
                    sendToEventPage(Error.message);
                });
            } else {
                getFromJIRA('/rest/api/2/search?jql=project=' + request.project + '&&maxResults=500').then(function (response) {
                    sendToEventPage(response);
                }, function (Error) {
                    sendToEventPage(Error.message);
                });
            }

        }

    });
}());
