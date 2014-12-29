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

    var projectSelect = document.getElementById('project'),
        versionSelect = document.getElementById('version'),
        submitButton = document.getElementById('submit'),
        linkToWebstore = document.getElementById('link-to-webstore');

    // Insert the JS needed for communication with the server
    chrome.tabs.executeScript(null, {
        file: 'js/getInfoFromJIRA.js'
    });

    // Perform the callback when a message is received from the content script
    // TODO check stack
    chrome.runtime.onMessage.addListener(function (message) {
        // Call the callback function
        onDataReceived(message);
    });

    // Send request to getInfoFromJIRA for all JIRA project
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "getProjects"
        });

        showLoading();
    });

    // Send request to getInfoFromJIRA for all versions of the selected project
    projectSelect.addEventListener('change', function (event) {
        if (event.target.value === 'default') {
            disableSubmitButton();
            return;
        } else {
            enableSubmitButton();
        }

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "getVersion",
                project: projectSelect.value
            });
        });

        showLoading();
    }, false);

    // Send request to getInfoFromJIRA for all issue from the selected project and version
    submitButton.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'getIssues',
                version: versionSelect.value,
                project: projectSelect.value
            });
        });

        // Opens preview.html into a new tab
        chrome.tabs.create({url: 'preview.html'});

    }, false);

    // Open a new tab to the chrome webstore
    linkToWebstore.addEventListener('click', function () {
        chrome.tabs.create({url: 'https://chrome.google.com/webstore/detail/jira-cards-for-task-board/pkjkejnmpailbogakjkpoefndabeenek/reviews'});
    }, false);

    /**
     * Process the received information from the requests
     * @param data {Object} the response from the JIRA server
     */
    function onDataReceived(data) {
        // Check if there is an error
        if (data.indexOf('Error') > -1) {
            showError();
            hideLoading();
            return;
        } else {
            hideError();
            hideLoading();
        }

        // Exit the function if the response is empty
        if (data[0] === undefined) {
            deleteInsertedData('version');
            return;
        }

        if (data[0].self.indexOf('version') > -1) {
            insertData(data, 'version', true);
        } else {
            insertData(data, 'project');
        }
        hideLoading();
    }

    /**
     * Shows the error and disables the form
     */
    function showError() {
        var field = document.getElementById('main-field'),
            error = document.getElementById('error');

        field.setAttribute('disabled', 'disabled');
        error.classList.remove('text-hide');
    }

    /**
     * Removes the error and enables the form
     */
    function hideError() {
        var field = document.getElementById('main-field'),
            error = document.getElementById('error');

        field.removeAttribute('disabled');
        error.classList.add('text-hide');
    }

    /**
     * Deletes all children of given element, except the first one
     * @param ID {String} DOM element ID
     */
    function deleteInsertedData(ID) {
        var element = document.getElementById(ID),
            elementChildren = element.children;

        for (var i = 1; i < elementChildren.length; i++) {
            element.removeChild(elementChildren[i]);
        }
    }

    /**
     * Populate the template with the received data
     * @param data {Object} the response from the JIRA server
     * @param ID {String} DOM element ID
     * @param deleteChildren {Boolean} Whether the children should be deleted
     */
    function insertData(data, ID, deleteChildren) {
        var template = document.querySelector('#template-for-option-tag'),
            element = document.getElementById(ID),
            fragment = new DocumentFragment(),
            clone,
            optionTag;

        if (deleteChildren === true) {
            deleteInsertedData(ID);
        }

        for (var i = 0; i < data.length; i++) {
            clone = template.content.cloneNode(true);

            optionTag = clone.querySelector('option');

            // Difference between JIRA versions
            if (data[i].key === undefined) {
                optionTag.value = data[i].id;
            } else {
                optionTag.value = data[i].key;
            }

            optionTag.innerText = data[i].name;

            fragment.appendChild(clone);
        }
        element.appendChild(fragment);
    }

    /**
     * Show loading indicator
     */
    function showLoading() {
        document.getElementById('loading').style.visibility = "visible";
    }

    /**
     * Hide loading indicator
     */
    function hideLoading() {
        document.getElementById('loading').style.visibility = "hidden";
    }

    /**
     * Disable submit button
     */
    function disableSubmitButton() {
        var submitButton = document.getElementById('submit');
        submitButton.setAttribute('disabled', 'disabled');
    }

    /**
     * Enable submit button
     */
    function enableSubmitButton() {
        var submitButton = document.getElementById('submit');
        submitButton.removeAttribute('disabled');
    }
}());
