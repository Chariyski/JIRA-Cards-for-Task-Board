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

    var page,
        card,
        model,
        store;

    window.addEventListener('load', function () {
        var form = document.getElementById('option-form'),
            printPreviewButton = document.getElementById('print-preview'),
            saveButton = document.getElementById('save');

        // Listener for data, send from getInfoFromJIRA.js
        chrome.runtime.onMessage.addListener(
            // Perform the callback when a message is received from the content script
            function (request, sender, sendResponse) {
                // Makes sure that this is executed only one time
                if (model.getIssues() !== undefined) {
                    return;
                }

                // Check if the received data is the needed one
                if (request.issues === undefined || request.issues.length < 1) {
                    page.message.showError();
                    page.message.hideLoading();

                    return;
                }

                // Show info text if there is nothing to print
                if (request.issues.length === 0) {
                    page.message.showInfo();
                    page.message.hideLoading();

                    return;
                }

                model.setIssues(request.issues);
                page.message.hideLoading();
                page.insertAssignees();
                card.createCards();
            }
        );

        // Event listener for user interaction on options form
        form.addEventListener('change', function (event) {
            // Change template
            if (event.target.id === 'template-type') {
                card.deleteCards();
                card.createCards();
            }

            // Hides cards with different assignee from the given one
            if (event.target.id === 'assignees') {
                card.showFromAssignees(event.target.value);
            }

            // Change font weight
            if (event.target.value === 'bold') {
                card.changeFontWeight(event.target.getAttribute('data-class'), event.target.checked);
            }

            // Hide/show parts from the cards
            if (event.target.value === 'show') {
                card.changeDisplay(event.target.getAttribute('data-class'), event.target.checked);
            }

            // Change font size
            if (event.target.id === 'font-size') {
                card.changeFontSize(event.target.value);
            }

            // Change summary font size
            if (event.target.id === 'heading-size') {
                card.changeHeadingFontSize(event.target.value);
            }
        }, false);

        // Opens print preview
        printPreviewButton.addEventListener('click', function () {
            window.print();
        }, false);

        // Save form options
        saveButton.addEventListener('click', function () {
            store.saveOptions();
            store.getOptions();
        }, false);

    }, false);

    /**
     * Object that processes the received data
     * @type {{issues: undefined, isReceivedDataValid: Function, getIssues: Function, setIssues: Function}}
     */
    model = {

        // All issues received from JIRA server
        issues: undefined,

        /**
         * Get issues
         * @returns {Object}
         */
        getIssues: function () {
            return this.issues;
        },

        /**
         * Set issues
         * @param data
         * @returns {model}
         */
        setIssues: function (data) {
            this.issues = data;
            return this;
        }
    };

    /**
     * Manipulates page elements
     * @type {{insertAssignees: Function, insertCSSRule: Function, message: {hideError: Function, hideInfo: Function, hideLoading: Function, showError: Function, showInfo: Function, showLoading: Function}}}
     */
    page = {

        /**
         * Insert unique assignee name, into the assignee select in the page
         */
        insertAssignees: function () {
            var issues = model.getIssues(),
                assigneesSelect = document.getElementById('assignees'),
                uniqueAssignees = [];

            for (var i = 0; i < issues.length; i++) {
                if (issues[i].fields.assignee && uniqueAssignees.indexOf(issues[i].fields.assignee.displayName) < 0) {
                    uniqueAssignees.push(issues[i].fields.assignee.displayName);
                }
            }

            for (var j = 0; j < uniqueAssignees.length; j++) {
                var newOptionTag = document.createElement('option');
                newOptionTag.innerText = uniqueAssignees[j];
                assigneesSelect.appendChild(newOptionTag);
            }
        },

        /**
         * Insert CSS rule in the last style sheet on the page
         * @param cssRule {string} CSS rule
         */
        insertCSSRule: function (cssRule) {
            var sheet = document.styleSheets[document.styleSheets.length - 1];
            sheet.insertRule(cssRule, sheet.cssRules.length);
        },

        // Message handling
        message: {
            hideError: function () {
                document.getElementById('message-error').style.display = 'none';
            },
            hideInfo: function () {
                document.getElementById('message-info').style.display = 'none';
            },
            hideLoading: function () {
                document.getElementById('message-loading').style.display = 'none';
            },
            showError: function () {
                document.getElementById('message-error').style.display = 'block';
            },
            showInfo: function () {
                document.getElementById('message-info').style.display = 'block';
            },
            showLoading: function () {
                document.getElementById('message-loading').style.display = 'block';
            }
        }
    };

    /**
     * Create/Delete Cards into/from the page
     * @type {{deleteCards: Function, changeDisplay: Function, changeFontWeight: Function, changeFontSize: Function, changeHeadingFontSize: Function, createCards: Function, getTemplate: Function, setTemplate: Function, showFromAssignees: Function}}
     */
    card = {

        /**
         * Delete all created cards
         */
        deleteCards: function () {
            var cartContainer = document.getElementById('cards-container');
            while (cartContainer.firstChild) {
                cartContainer.removeChild(cartContainer.firstChild);
            }
        },

        /**
         * Change element display CSS property
         * @param elementClassName {String} The element class name, which need to be changed
         * @param isShown {boolean} true for displaying element, false for not displaying the element
         */
        changeDisplay: function (elementClassName, isShown) {
            if (isShown === true) {
                page.insertCSSRule('.card .' + elementClassName + '{ display: flex; }');
            } else {
                page.insertCSSRule('.card .' + elementClassName + '{  display: none; }');
            }
        },

        /**
         * Change font weight
         * @param elementClassName {String} The element class name, which need to be changed
         * @param isBold {boolean} If true the element will be bold
         */
        changeFontWeight: function (elementClassName, isBold) {
            if (isBold === true) {
                page.insertCSSRule('.card .' + elementClassName + '{ font-weight: 900; }');
            } else {
                page.insertCSSRule('.card .' + elementClassName + '{ font-weight: 100; }');
            }
        },

        /**
         * Change font size on all card elements
         * @param fontSize {String} font size value
         */
        changeFontSize: function (fontSize) {
            page.insertCSSRule('.card{ font-size:' + fontSize + 'px; }');
        },

        /**
         * Change font size on the summary
         * @param fontSize {String} font size value
         */
        changeHeadingFontSize: function (fontSize) {
            page.insertCSSRule('.summary{ font-size:' + fontSize + 'px; }');
        },

        /**
         * Create cards for task board
         */
        createCards: function () {
            var issues = model.getIssues(),
                template = document.getElementById(this.getTemplate()),
                cardsWrapper = document.getElementById('cards-container'),
                fragment = new DocumentFragment();

            // Insert the data into the card template
            for (var i = 0; i < issues.length; i++) {
                var clone = template.content.cloneNode(true),
                    card = clone.querySelector('[data-clone="card"]');

                if (issues[i].fields.fixVersions[0]) {
                    var tact = clone.querySelector('[data-clone="tact"]');
                    tact.innerText = issues[i].fields.fixVersions[0].name;
                }

                if (issues[i].fields.priority.name) {
                    var priority = clone.querySelector('[data-clone="priority"]');
                    priority.innerText = issues[i].fields.priority.name;
                }

                if (issues[i].key) {
                    var issueKey = clone.querySelector('[data-clone="key"]');
                    issueKey.innerText = issues[i].key;
                }

                var subTask = clone.querySelector('[data-clone="subtask"]');
                if (issues[i].fields.issuetype.subtask) {
                    subTask.innerText = issues[i].fields.parent.key;
                } else {
                    subTask.parentNode.removeChild(subTask);
                }

                if (issues[i].fields.summary) {
                    var summary = clone.querySelector('[data-clone="summary"]');
                    summary.innerText = issues[i].fields.summary;
                }

                var assignee = clone.querySelector('[data-clone="assignee"]');
                if (issues[i].fields.assignee) {
                    assignee.innerText = issues[i].fields.assignee.displayName;
                    card.setAttribute('data-assignee', issues[i].fields.assignee.displayName);
                } else {
                    assignee.parentNode.removeChild(assignee);
                    card.setAttribute('data-assignee', 'unassigned');
                }

                fragment.appendChild(clone);
            }

            // Insert the cards into the page
            cardsWrapper.appendChild(fragment);
        },

        /**
         * Get the ID of the chosen card template
         * @returns {string}
         */
        getTemplate: function () {
            return document.getElementById('template-type').value;
        },

        /**
         * Get the ID of the chosen card template
         * @param templateID {String}
         * @returns {card}
         */
        setTemplate: function (templateID) {
            document.getElementById('template-type').value = templateID;

            return this;
        },

        /**
         * Show cards only from given assignee
         * @param assignee {String}
         */
        showFromAssignees: function (assignee) {
            page.insertCSSRule('.card[data-assignee]{ display:flex; }');

            if (assignee === 'assigned') {
                page.insertCSSRule('.card[data-assignee="unassigned"]{ display:none; }');
            } else if (event.target.value !== 'all') {
                page.insertCSSRule('.card:not([data-assignee="' + assignee + '"]){ display:none; }');
            }
        }
    };

    store = {
        applyOptions: function () {

        },
        getOptions: function () {
            chrome.storage.sync.get('JCTB', function (obj) {
                console.log(obj);
            });
        },
        saveOptions: function () {
            var options = {
                'JCTB': {
                    template: undefined,
                    assignee: undefined,
                    fields: {
                        tact: {
                            bold: undefined,
                            show: undefined
                        },
                        priority: {
                            bold: undefined,
                            show: undefined
                        },
                        key: {
                            bold: undefined,
                            show: document.getElementById('show-key').checked
                        },
                        subtask: {
                            bold: undefined,
                            show: undefined
                        },
                        summary: {
                            bold: undefined,
                            show: undefined
                        },
                        assignee: {
                            bold: undefined,
                            show: undefined
                        },
                        fontSize: undefined,
                        headingFontSize: undefined
                    }
                }
            };

            chrome.storage.sync.set(options, function () {
                console.log('Saved');
            });
        }
    }
}());