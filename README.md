# The project is out of maintenance.
The Atlassian API was been changed again and currently the extension is not working and need to be fixed.

## JIRA Cards for Task Board
Chrome extensions for printing task board cards from JIRA. Useful for developers working on Scrum and/or Agile methodology.

## Installation
Download and Install JSC from [Chrome WebStore](https://chrome.google.com/webstore)

## How to use
* Click the extension icon
* Go to Configuration page
    - Enter JIRA base URL address in the input field
    - Choose a project
    - If you don't want to repeat the last two steps, press the 'SAVE' button
* Go to JIRA page
* Choose a sprint

After the cards are loaded, you will be able to change their visual style and print them.

## Features

* Get JIRA issues from certain project and version
* Create printable cards
* Show/hide different parts of the cards
* Show/hide different task cards in print preview
* Bold/unbold different parts of the cards
* Change the font of cards
* Show cards from assignee
* Save options

## How to setup

1. Install [Node](https://nodejs.org/en/), [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) and [Bower](http://bower.io/)
2. Clone the project locally
3. Install dependencies with the following commands:
    - npm install
    - bower install
4. To build the project use the following command:
    - gulp default
5. Open Chrome and type "chrome://extensions/" in the URL bar
6. Check “Developer mode” and then click "Load unpacked extension..."
7. From the newly opened window select the "dist" folder from the locally cloned project

## Changelog

### [v2.0.0](https://github.com/Chariyski/JIRA-Cards-for-Task-Board/issues?q=is%3Aissue+milestone%3Av2.0.0+is%3Aclosed)
* Redesign of the project using Polymer

### [v1.4.0](https://github.com/Chariyski/JIRA-Cards-for-Task-Board/issues?q=is%3Aissue+milestone%3Av1.4.0+is%3Aclosed)
* Added a new template with tree new fields:
    - description
    - estimated time in hours
    - type of issue

### [v1.3.0](https://github.com/Chariyski/JIRA-Cards-for-Task-Board/issues?q=is%3Aissue+milestone%3Av1.3.0+is%3Aclosed)
* Added hide/show buttons, for hiding/showing all cards in print preview.

### [v1.2.0](https://github.com/Chariyski/JIRA-Cards-for-Task-Board/issues?q=is%3Aissue+milestone%3Av1.2.0+is%3Aclosed)
* Added a new template.

### [v1.1.0](https://github.com/Chariyski/JIRA-Cards-for-Task-Board/issues?q=is%3Aissue+milestone%3Av1.1.0+is%3Aclosed)
* Added a button next to each card, for hiding or showing the card in print preview.

### v1.0.0
* Initial version
