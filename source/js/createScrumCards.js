(function () {
    'use strict';

    /**
     * Create scrum cards from JIRA issues
     * @type {{insertTemplate: Function, insertCSS: Function, createJSONModel: Function, createScrumCards: Function, init: Function}}
     */
    var JSC = {

        /**
         * Create a template for single scrum card
         */
        insertTemplate: function () {
            // Verify whether the template was not inserted before
            if (document.getElementById('scrumCardTemplate')) {
                return;
            }

            // Test to see if the browser supports the HTML template element by checking
            // for the presence of the template element's content attribute.
            if ('content' in document.createElement('template')) {
                // Create template tag
                var template = document.createElement('template');
                template.id = 'scrumCardTemplate';

                // The string is copied from template.html
                template.innerHTML = '<div class="scrumCard"> <aside class="avatar"></aside> <section class="scrumCardBody"> <div class="scrumCardHeader"><p class="issueKey"></p> <p class="tact"></p></div> <div class="scrumCardSection"><p class="summary"></p> <p class="assignee"></p></div> </section> </div>';

                // Insert the template in the body
                document.body.appendChild(template);
            } else {
                alert('Please update your browser!');
            }
        },

        /**
         * Create style tag with needed CSS styles
         */
        insertCSS: function () {
            // Verify whether the styles ware not inserted before
            if (document.getElementById('scrumCardTemplateCSS')) {
                return;
            }

            // Create template tag
            var previewStylesInBrowser = document.createElement('style');
            previewStylesInBrowser.id = 'scrumCardTemplateCSS';

            // Those styles are copied from style.css
            previewStylesInBrowser.innerText = '@media all { .scrumCardsWrapper { display: none; } } @media print { body > *:not(.scrumCardsWrapper) { display: none !important; } .scrumCardsWrapper { display: block; } /* Layout */ .scrumCard, .scrumCard * { box-sizing: border-box; margin: 0; padding: 0; text-align: center; } .scrumCard { float: left; width: 47%; margin: 1%; display: flex; flex-direction: row; justify-content: flex-start; align-content: flex-start; page-break-inside: avoid; } .scrumCard:nth-child(odd) { clear: both; } .scrumCard .avatar { min-width: 3.5cm; min-height: 5cm; } .scrumCard .scrumCardBody { flex: 1 1 auto; display: flex; flex-direction: column; } .scrumCard .scrumCardHeader { display: flex; flex-direction: row; } .scrumCardHeader .issueKey, .scrumCardHeader .tact { flex: 1 1 auto; } .scrumCard .scrumCardSection { flex: 1 1 auto; display: flex; flex-direction: column; } .scrumCardSection .summary { flex: 4 1 auto; display: flex; flex-direction: column; justify-content: center; word-wrap: break-word; } .scrumCardSection .assignee { flex: 1 1 auto; } /* Theming */ .scrumCard { border: 4px solid #000; font-size: 22px; line-height: 1.62; font-weight: 900; } .scrumCard .scrumCardBody, .scrumCard .tact { border-left: 4px solid #000; } .scrumCard .scrumCardHeader { border-bottom: 4px solid #000; } .scrumCardSection .summary { font-size: 30px; line-height: 1.2; } .scrumCardSection .assignee { font-weight: 100; } }';

            // Insert the styles in the document
            document.getElementsByTagName('head')[0].appendChild(previewStylesInBrowser);
        },

        /**
         * Create a JSON model with all available JIRA issues on the current page
         * @returns {{issues: Array}}
         */
        createJSONModel: function () {
            var issues,
                newIssue,
                model;

            issues = document.getElementsByClassName('gh-issue');

            model = {
                "issues": []
            };

            // Fills model.issues with information for printing
            for (var i = 0; i < issues.length; i++) {
                newIssue = {};

                newIssue.key = issues[i].querySelector('.gh-issue-key a span').innerText.trim();

                newIssue.tact = issues[i].querySelector('[data-fieldid="fixVersions"] a').innerText.trim();

                if (issues[i].querySelector('.gh-issue-related a span')) {
                    newIssue.ralatedIssue = issues[i].querySelector('.gh-issue-related a span').innerText.trim();
                }

                newIssue.summary = issues[i].querySelector('[data-fieldid="summary"] > div').innerText.trim();

                if (issues[i].querySelector('[data-fieldid="assignee"] div')) {
                    newIssue.assignee = issues[i].querySelector('[data-fieldid="assignee"] div').childNodes[2].textContent.trim();
                }

                model.issues.push(newIssue);
            }

            return model;
        },

        /**
         * Create printable scrum cards
         */
        createScrumCards: function () {
            var model,
                template,
                wrapper = document.getElementById('scrumCardWrapper');

            // If the template was created before, deletes it
            // This way the scrum cards will be up to date
            if (wrapper) {
                wrapper.parentElement.removeChild(wrapper);
            }

            model = this.createJSONModel();
            template = document.querySelector('#scrumCardTemplate');

            wrapper = document.createElement('div');
            wrapper.id = 'scrumCardWrapper';
            wrapper.className = 'scrumCardsWrapper';

            for (var i = 0; i < model.issues.length; i++) {
                var clone = template.content.cloneNode(true);

                var issueKey = clone.querySelector('.issueKey');
                issueKey.innerText = model.issues[i].key;

                var tact = clone.querySelector('.tact');
                tact.innerText = model.issues[i].tact;

                var summary = clone.querySelector('.summary');
                summary.innerText = model.issues[i].summary;

                var assignee = clone.querySelector('.assignee');
                if (model.issues[i].assignee && model.issues[i].assignee !== 'Unassigned') {
                    assignee.innerText = model.issues[i].assignee;
                } else {
                    assignee.parentNode.removeChild(assignee)
                }

                wrapper.appendChild(clone);
                document.body.appendChild(wrapper);
            }
        },

        /**
         * Initialise extension logic
         */
        init: function () {
            // Makes sure that there are JIRA issues in the current page
            if (document.getElementById('jira') && document.getElementsByClassName('gh-issue').length > 0) {
                this.insertTemplate();
                this.insertCSS();
                this.createScrumCards();

                return true;
            } else {
                alert('Please open JIRA task board');
                return false;
            }

        }
    };

    // Initialise
    var init = JSC.init();

    // Open print preview for better user experience
    if (init) {
        window.print();
    }

}());
