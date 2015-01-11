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

    // Form controls
    var cardTemplate = document.getElementById('template-type'),
        fromAssignee = document.getElementById('assignees'),
        tactBold = document.getElementById('bold-tact'),
        priorityBold = document.getElementById('bold-priority'),
        keyBold = document.getElementById('bold-key'),
        subtaskBold = document.getElementById('bold-subtask'),
        summaryBold = document.getElementById('bold-summary'),
        assigneeBold = document.getElementById('bold-assignee'),
        tactShow = document.getElementById('show-tact'),
        priorityShow = document.getElementById('show-priority'),
        keyShow = document.getElementById('show-key'),
        subtaskShow = document.getElementById('show-subtask'),
        summaryShow = document.getElementById('show-summary'),
        assigneeShow = document.getElementById('show-assignee'),
        fontSize = document.getElementById('font-size'),
        headingFontSize = document.getElementById('heading-size');

    var page,
        card,
        model,
        options;

    /**
     * Object that processes the received data
     * @type {{_issues: undefined, getIssues: Function, setIssues: Function}}
     */
    model = {

        // All issues received from JIRA server
        _issues: undefined,

        /**
         * Get issues
         * @returns {Object}
         */
        getIssues: function () {
            return this._issues;
        },

        /**
         * Set issues
         * @param data
         * @returns {model}
         */
        setIssues: function (data) {
            this._issues = data;
            return this;
        }
    };

    /**
     * Manipulates page elements
     * @type {{insertAssignees: Function, message: {_create: Function, delete: Function, show: Function}}}
     */
    page = {

        /**
         * Insert unique assignee name, into the assignee select in the page
         */
        insertAssignees: function () {
            var issues = model.getIssues(),
                uniqueAssignees = [];

            for (var i = 0; i < issues.length; i++) {
                if (issues[i].fields.assignee && uniqueAssignees.indexOf(issues[i].fields.assignee.displayName) < 0) {
                    uniqueAssignees.push(issues[i].fields.assignee.displayName);
                }
            }

            for (var j = 0; j < uniqueAssignees.length; j++) {
                var newOptionTag = document.createElement('option');
                newOptionTag.innerText = uniqueAssignees[j];
                fromAssignee.appendChild(newOptionTag);
            }
        },

        // Message handling
        message: {
            /**
             * Create HTML tag with all the information
             * @param message {Object} Includes massage type and text that will be shown
             * @returns {HTMLElement}
             * @private
             */
            _create: function (message) {
                var type = message.type,
                    text = message.text,
                    massageTag = document.createElement('span');

                massageTag.classList.add('alert');
                massageTag.classList.add('alert-' + type);
                massageTag.innerText = message.text;

                return massageTag;
            },

            /**
             * Delete all messages in the message container
             */
            delete: function () {
                var messageContainer = document.getElementById('message');

                while (messageContainer.firstChild) {
                    messageContainer.removeChild(messageContainer.firstChild);
                }
            },

            /**
             *
             * Visualise the message and remove it, if it is not a error message
             * @param message {Object} Includes massage type and text that will be shown
             */
            show: function (message) {
                var messageContainer = document.getElementById('message'),
                    messageTag = this._create(message);

                messageContainer.appendChild(messageTag);

                // Delete info message after 4s
                if (message.type === 'info') {
                    setTimeout(this.delete, 4000);
                }
            }
        }
    };

    /**
     * Manipulates Cards
     * @type {{changeDisplay: Function, changeFontWeight: Function, changeFontSize: Function, changeHeadingFontSize: Function, deleteCards: Function, createCards: Function, _insertCSSRule: Function, showFromAssignees: Function}}
     */
    card = {

        /**
         * Change element display CSS property
         * @param CSSClassName{String} The element class name, which need to be changed
         * @param isVisible {boolean} true for displaying element, false for not displaying the element
         */
        changeDisplay: function (CSSClassName, isVisible) {
            if (isVisible) {
                this._insertCSSRule('.' + CSSClassName + '{display:flex;}');
            } else {
                this._insertCSSRule('.' + CSSClassName + '{display:none;}');
            }
        },

        /**
         * Change font weight
         * @param CSSClassName {String} The element class name, which need to be changed
         * @param isBold {boolean} If true the element will be bold
         */
        changeFontWeight: function (CSSClassName, isBold) {
            if (isBold) {
                this._insertCSSRule('.' + CSSClassName + '{font-weight:900;}');
            } else {
                this._insertCSSRule('.' + CSSClassName + '{font-weight:100;}');
            }
        },

        /**
         * Change font size on all card elements
         * @param fontSize {String} font size value
         */
        changeFontSize: function (fontSize) {
            this._insertCSSRule('.card{ font-size:' + fontSize + '; }');
        },

        /**
         * Change font size on the summary
         * @param fontSize {String} font size value
         */
        changeHeadingFontSize: function (fontSize) {
            this._insertCSSRule('.summary{ font-size:' + fontSize + '; }');
        },

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
         * Create cards for task board
         */
        createCards: function () {
            var issues = model.getIssues(),
                template = document.getElementById(cardTemplate.value),
                cardsWrapper = document.getElementById('cards-container'),
                fragment = new DocumentFragment();

            // Insert the data into the card template
            for (var i = 0; i < issues.length; i++) {
                var clone = template.content.cloneNode(true),
                    card = clone.querySelector('[data-clone="card"]');

                if (issues[i].fields.fixVersions[0]) {
                    var tact = clone.querySelector('[data-clone="tact"]');

                    if (tact) {
                        tact.innerText = issues[i].fields.fixVersions[0].name;
                    }
                }

                if (issues[i].fields.priority.name) {
                    var priority = clone.querySelector('[data-clone="priority"]');
                    if (priority) {
                        priority.innerText = issues[i].fields.priority.name;
                    }
                }

                if (issues[i].key) {
                    var issueKey = clone.querySelector('[data-clone="key"]');
                    if (issueKey) {
                        issueKey.innerText = issues[i].key;
                    }
                }

                var subTask = clone.querySelector('[data-clone="subtask"]');
                if (issues[i].fields.issuetype.subtask && subTask) {
                    subTask.innerText = issues[i].fields.parent.key;
                } else {
                    subTask.parentNode.removeChild(subTask);
                }

                if (issues[i].fields.summary) {
                    var summary = clone.querySelector('[data-clone="summary"]');
                    if (summary) {
                        summary.innerText = issues[i].fields.summary;
                    }
                }

                var assignee = clone.querySelector('[data-clone="assignee"]');
                if (issues[i].fields.assignee && assignee) {
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
         * Insert CSS rule in the last style sheet on the page
         * @param cssRule {string} CSS rule
         */
        _insertCSSRule: function (cssRule) {
            var sheet = document.styleSheets[document.styleSheets.length - 1];
            sheet.insertRule(cssRule, sheet.cssRules.length);
        },

        /**
         * Show cards only from given assignee
         * @param assignee {String}
         */
        showFromAssignees: function (assignee) {
            this._insertCSSRule('.card[data-assignee]{ display:flex; }');

            if (assignee === 'assigned') {
                this._insertCSSRule('.card[data-assignee="unassigned"]{ display:none; }');
            } else if (assignee !== 'all') {
                this._insertCSSRule('.card:not([data-assignee="' + assignee + '"]){ display:none; }');
            }
        }
    };

    /**
     * Responsible for options
     * @type {{apply: Function, save: Function}}
     */
    options = {

        /**
         * Apples all saved options
         */
        apply: function () {
            chrome.storage.sync.get('cards', function (object) {
                var options;

                if (object.cards === undefined) {
                    return;
                }

                options = object.cards;

                // Set template
                if (options.template !== cardTemplate.value) {
                    cardTemplate.value = options.template;
                }

                // Set fromAssignees
                if (options.fromAssignees !== fromAssignee.value) {
                    fromAssignee.value = options.fromAssignees;

                    card.showFromAssignees(fromAssignee.value);
                }

                // Set bold style
                if (options.fields.tact.bold !== tactBold.checked) {
                    tactBold.checked = options.fields.tact.bold;

                    card.changeFontWeight(tactShow.getAttribute('data-class'), tactShow.checked);
                }

                // Set bold style
                if (options.fields.priority.bold !== priorityBold.checked) {
                    priorityBold.checked = options.fields.priority.bold;

                    card.changeFontWeight(priorityShow.getAttribute('data-class'), priorityShow.checked);
                }

                // Set bold style
                if (options.fields.key.bold !== keyBold.checked) {
                    keyBold.checked = options.fields.key.bold;

                    card.changeFontWeight(subtaskShow.getAttribute('data-class'), subtaskShow.checked);
                }

                // Set bold style
                if (options.fields.subtask.bold !== subtaskBold.checked) {
                    subtaskBold.checked = options.fields.subtask.bold;

                    card.changeFontWeight(keyShow.getAttribute('data-class'), keyShow.checked);
                }

                // Set bold style
                if (options.fields.summary.bold !== summaryBold.checked) {
                    summaryBold.checked = options.fields.summary.bold;

                    card.changeFontWeight(summaryShow.getAttribute('data-class'), summaryShow.checked);
                }

                // Set bold style
                if (options.fields.assignee.bold !== assigneeBold.checked) {
                    assigneeBold.checked = options.fields.assignee.bold;

                    card.changeFontWeight(assigneeShow.getAttribute('data-class'), assigneeShow.checked);
                }

                // Set display style
                if (options.fields.tact.show !== tactShow.checked) {
                    tactShow.checked = options.fields.tact.show;

                    card.changeDisplay(tactShow.getAttribute('data-class'), tactShow.checked);
                }

                // Set display style
                if (options.fields.priority.show !== priorityShow.checked) {
                    priorityShow.checked = options.fields.priority.show;

                    card.changeDisplay(priorityShow.getAttribute('data-class'), priorityShow.checked);
                }

                // Set display style
                if (options.fields.subtask.show !== subtaskShow.checked) {
                    subtaskShow.checked = options.fields.subtask.show;

                    card.changeDisplay(subtaskShow.getAttribute('data-class'), subtaskShow.checked);
                }

                // Set display style
                if (options.fields.key.show !== keyShow.checked) {
                    keyShow.checked = options.fields.key.show;

                    card.changeDisplay(keyShow.getAttribute('data-class'), keyShow.checked);
                }

                // Set display style
                if (options.fields.summary.show !== summaryShow.checked) {
                    summaryShow.checked = options.fields.summary.show;

                    card.changeDisplay(summaryShow.getAttribute('data-class'), summaryShow.checked);
                }

                // Set display style
                if (options.fields.assignee.show !== assigneeShow.checked) {
                    assigneeShow.checked = options.fields.assignee.show;

                    card.changeDisplay(assigneeShow.getAttribute('data-class'), assigneeShow.checked);
                }

                // Set font style
                if (options.fields.fontSize !== fontSize.value) {
                    fontSize.value = options.fields.fontSize;

                    card.changeFontSize(fontSize.value);
                }

                // Set font style
                if (options.fields.headingFontSize !== headingFontSize.value) {
                    headingFontSize.value = options.fields.headingFontSize;

                    card.changeFontSize(fontSize.value);
                }

            });
        },

        /**
         * Save options form state
         */
        save: function () {
            var options = {
                'cards': {
                    template: cardTemplate.value,
                    fromAssignees: fromAssignee.value,
                    fields: {
                        tact: {
                            bold: tactBold.checked,
                            show: tactShow.checked
                        },
                        priority: {
                            bold: priorityBold.checked,
                            show: priorityShow.checked
                        },
                        key: {
                            bold: keyBold.checked,
                            show: keyShow.checked
                        },
                        subtask: {
                            bold: subtaskBold.checked,
                            show: subtaskShow.checked
                        },
                        summary: {
                            bold: summaryBold.checked,
                            show: summaryShow.checked
                        },
                        assignee: {
                            bold: assigneeBold.checked,
                            show: assigneeShow.checked
                        },
                        fontSize: fontSize.value,
                        headingFontSize: headingFontSize.value
                    }
                }
            };

            chrome.storage.sync.set(options, function () {
                page.message.show({
                    type: 'info',
                    text: 'All options are saved.'
                });
            });
        }
    };

    // Add Page events listeners
    window.addEventListener('load', function () {
        var form = document.getElementById('option-form'),
            printPreviewButton = document.getElementById('print-preview'),
            saveButton = document.getElementById('save'),
            cardContainer = document.getElementById('cards-container');

        // If there are any saved option, apples them.
        options.apply();

        // Listener for data, send from getInfoFromJIRA.js
        chrome.runtime.onMessage.addListener(
            // Perform the callback when a message is received from the content script
            function (request, sender, sendResponse) {
                // Makes sure that this is executed only one time
                if (model.getIssues() !== undefined) {
                    return;
                }

                // Delete loading indicator
                page.message.delete();

                // Check if there is data in the request
                if (request.issues === undefined) {
                    page.message.show({
                        text: 'Something went wrong, please try again later.',
                        type: 'danger'
                    });
                    return;
                }

                // Show info text if there is nothing to print
                if (request.issues.length === 0) {
                    page.message.show({
                        text: 'There are no issues from this project version, that can be print.',
                        type: 'warning'
                    });
                    return;
                }

                model.setIssues(request.issues);
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
            options.save();
        }, false);

        cardContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('card')) {
                event.target.classList.toggle('card-print--visible');
                event.target.classList.toggle('card-print--hidden');
            }
        }, false);
    }, false);

}());
