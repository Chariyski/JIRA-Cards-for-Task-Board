(function (document) {
    'use strict';

    var app = document.querySelector('#app');

    window.addEventListener('WebComponentsReady', function () {

        app._createReferencesForUserConfiguration();

        app.loadUserConfiguration();

        app.$['settings-checkbox-container'].onchange = function (event) {
            app._updateScrumCardSettings();
        };

        app.$['jira-url-address'].onkeyup = function (event) {
            app._getProjects();
        };

        app.$['jira-green-hopper'].onclick = function (event) {
            app._getProjects();
        };

        app.$['dropdown-for-jira-projects'].onclick = function (event) {
            var target = event.target;

            if (target.nodeName === 'SPAN') {
                target = target.parentElement;
            }

            if (target.nodeName !== 'PAPER-ITEM') {
                return;
            }

            app.jiraProject = target.value;
            app.jiraProjectName = target.label;
            app._getSprintsForProject();
        };
    });

    // TODO remove
    app.interfaceUpdate = function () {
        // TODO remove
    };

    app._getProjects = function () {
        var that = this;

        // Delete all elements in the array,
        // this way the selectedItem in the paper-dropdown will be updated accordingly
        this.editedProjects = [];

        // The timeout is needed because the "invalid" property of the paper-input need to be updated after the keyup
        setTimeout(function () {
            let isInputInvalid = that.$['jira-url-address'].invalid;
            let ajaxForProjects = that.$['jira-projects-ajax'];

            if (isInputInvalid) {
                return;
            }

            if (that.isAJAXtoGreenHopper) {
                ajaxForProjects.url = that.jiraURL + '/rest/greenhopper/1.0/rapidview';
            } else {
                ajaxForProjects.url = that.jiraURL + '/rest/api/2/project/';
            }

            ajaxForProjects.generateRequest();
        }, 100);
    };

    app._getSprintsForProject = function () {
        let ajaxForVersions = this.$['jira-project-sprints-ajax'];
        let project = this.jiraProject;
        let url = this.jiraURL;

        if (!url || !project) {
            return;
        }

        if (this.isAJAXtoGreenHopper) {
            ajaxForVersions.url = url + '/rest/greenhopper/1.0/sprintquery/' + project + '?includeFutureSprints=true&includeHistoricSprints=false';
        } else {
            ajaxForVersions.url = url + '/rest/api/2/project/' + project + '/versions';
        }

        ajaxForVersions.generateRequest();
    };

    app.getSprintIssues = function (event) {
        var target = event.target;

        if (target.nodeName === 'SPAN') {
            target = target.parentElement;
        }

        if (target.nodeName !== 'PAPER-ITEM') {
            return;
        }

        let sprint = target.value;

        let AJAXForSprintIssues = this.$['jira-sprint-issues-ajax'];

        if (this.isAJAXtoGreenHopper) {
            AJAXForSprintIssues.url = this.jiraURL + '/rest/api/2/search?jql=Sprint=' + sprint + '&&maxResults=500';
        } else {
            AJAXForSprintIssues.url = this.jiraURL + '/rest/api/2/search?jql=project=' + this.jiraProject + '+and+fixVersion=' + sprint + '&&maxResults=500';
        }

        AJAXForSprintIssues.generateRequest();
    };

    // =========================================================
    // UI
    // =========================================================

    // Scrum card data for the "design" page
    app.demoScrumCard = [{
        key: '302',
        fields: {
            summary: 'This is the task summary',
            description: 'This is some description about the task. Lorem ipsum dolor sit amet, consectetur adipisicing elit!',
            issuetype: {
                name: 'Task',
                subtask: true
            },
            parent: {
                key: '298',
                fields: {
                    issuetype: {
                        name: 'Backlog Item'
                    }
                }
            },
            priority: {
                name: 'Medium'
            },
            fixVersions: [{
                name: '1.20'
            }, {
                name: '1.30'
            }],
            assignee: {
                displayName: 'John Doe'
            }
        }
    }];

    /**
     * Close drawer after menu item is selected if drawerPanel is narrow
     */
    app.onMenuSelect = function () {
        let drawerPanel = this.$['paper-drawer-panel'];
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    /**
     * Show message to the user.
     * @param {string} text - The text to display in the toast.
     * @param {number} duration - The duration in milliseconds to show the toast.
     */
    app.showMessage = function (text, duration) {
        let messageToast = app.$['custom-message'];

        if (text) {
            messageToast.setAttribute('text', text);
        } else {
            console.warn('Some text must be given as parameter');
            return;
        }

        messageToast.removeAttribute('duration');

        if (duration) {
            messageToast.setAttribute('duration', duration);
        } else {
            messageToast.setAttribute('duration', 6000);
        }

        messageToast.show();
    };

    // =========================================================
    // Extension storage
    // =========================================================

    /**
     * Load user configuration from chrome storage
     */
    app.loadUserConfiguration = function () {
        var that = this;

        chrome.storage.sync.get('settings', function (object) {

            if (object.settings === undefined) {
                that._defaultsScrumCardSettings();
                return;
            }

            let settings = object.settings;
            let scrumCard = object.settings.scrumCard;

            app.jiraURL = settings.jiraURL;
            app.jiraProject = settings.jiraProject;
            app.jiraProjectName = settings.jiraProjectName;
            app.isAJAXtoGreenHopper = settings.isAJAXtoGreenHopper;

            app.scrumCardSettings = {
                fontSize: scrumCard.fontSize,
                issueType: {
                    isBold: scrumCard.issueType.isBold,
                    isVisible: scrumCard.issueType.isVisible
                },
                issueKey: {
                    isBold: scrumCard.issueKey.isBold,
                    isVisible: scrumCard.issueKey.isVisible
                },
                parentName: {
                    isBold: scrumCard.parentName.isBold,
                    isVisible: scrumCard.parentName.isVisible
                },
                parentKey: {
                    isBold: scrumCard.parentKey.isBold,
                    isVisible: scrumCard.parentKey.isVisible
                },
                issuePriority: {
                    isBold: scrumCard.issuePriority.isBold,
                    isVisible: scrumCard.issuePriority.isVisible
                },
                issueFixVersions: {
                    isBold: scrumCard.issueFixVersions.isBold,
                    isVisible: scrumCard.issueFixVersions.isVisible
                },
                issueSummary: {
                    isBold: scrumCard.issueSummary.isBold,
                    isVisible: scrumCard.issueSummary.isVisible
                },
                issueDescription: {
                    isBold: scrumCard.issueDescription.isBold,
                    isVisible: scrumCard.issueDescription.isVisible
                },
                issueAssignee: {
                    isBold: scrumCard.issueAssignee.isBold,
                    isVisible: scrumCard.issueAssignee.isVisible
                }
            };

            that.showMessage('All user options ware loaded.');
            that.interfaceUpdate();

            that._getProjects();
            that._getSprintsForProject();
        });
    };

    /**
     * Save user configuration from chrome storage
     * TODO create two methods for option card/config
     */
    app.saveUserConfiguration = function () {
        let scrumCardSettings = app.scrumCardSettings;
        let project = app.$['dropdown-for-jira-projects'].selectedItem;

        let optionsToBeSaved = {
            settings: {
                jiraURL: app.jiraURL,
                jiraProject: project ? project.value : '',
                jiraProjectName: project ? project.label : '',
                isAJAXtoGreenHopper: app.isAJAXtoGreenHopper,

                scrumCard: {
                    fontSize: scrumCardSettings.fontSize,
                    issueType: {
                        isBold: scrumCardSettings.issueType.isBold,
                        isVisible: scrumCardSettings.issueType.isVisible
                    },
                    issueKey: {
                        isBold: scrumCardSettings.issueKey.isBold,
                        isVisible: scrumCardSettings.issueKey.isVisible
                    },
                    parentName: {
                        isBold: scrumCardSettings.parentName.isBold,
                        isVisible: scrumCardSettings.parentName.isVisible
                    },
                    parentKey: {
                        isBold: scrumCardSettings.parentKey.isBold,
                        isVisible: scrumCardSettings.parentKey.isVisible
                    },
                    issuePriority: {
                        isBold: scrumCardSettings.issuePriority.isBold,
                        isVisible: scrumCardSettings.issuePriority.isVisible
                    },
                    issueFixVersions: {
                        isBold: scrumCardSettings.issueFixVersions.isBold,
                        isVisible: scrumCardSettings.issueFixVersions.isVisible
                    },
                    issueSummary: {
                        isBold: scrumCardSettings.issueSummary.isBold,
                        isVisible: scrumCardSettings.issueSummary.isVisible
                    },
                    issueDescription: {
                        isBold: scrumCardSettings.issueDescription.isBold,
                        isVisible: scrumCardSettings.issueDescription.isVisible
                    },
                    issueAssignee: {
                        isBold: scrumCardSettings.issueAssignee.isBold,
                        isVisible: scrumCardSettings.issueAssignee.isVisible
                    }
                }
            }
        };

        chrome.storage.sync.set(optionsToBeSaved, function () {
            app.showMessage('All user options ware save.');
        });
    };

    /**
     * Remove user configuration from chrome storage
     */
    app.removeUserConfiguration = function () {
        chrome.storage.sync.remove('settings', function (object) {
            // todo some message
        });
    };

    // =========================================================
    // Private methods
    // =========================================================

    /**
     * Create needed reference for data binding and loading user configuration
     * @private
     */
    app._createReferencesForUserConfiguration = function () {
        this.scrumCardSettings = {
            fontSize: {}, // ToDo try to fine why there is an error with  Object.create(null)
            issueType: Object.create(null),
            issueKey: Object.create(null),
            parentName: Object.create(null),
            parentKey: Object.create(null),
            issuePriority: Object.create(null),
            issueFixVersions: Object.create(null),
            issueSummary: Object.create(null),
            issueDescription: Object.create(null),
            issueAssignee: Object.create(null)
        };

    };

    /**
     * Default user setting for scrum card visualization
     * @private
     */
    app._defaultsScrumCardSettings = function () {
        this.scrumCardSettings = {
            fontSize: 20,
            issueType: {
                isBold: false,
                isVisible: true
            },
            issueKey: {
                isBold: false,
                isVisible: true
            },
            parentName: {
                isBold: false,
                isVisible: true
            },
            parentKey: {
                isBold: false,
                isVisible: true
            },
            issuePriority: {
                isBold: false,
                isVisible: true
            },
            issueFixVersions: {
                isBold: false,
                isVisible: true
            },
            issueSummary: {
                isBold: true,
                isVisible: true
            },
            issueDescription: {
                isBold: false,
                isVisible: false
            },
            issueAssignee: {
                isBold: false,
                isVisible: true
            }
        }
    };

    /**
     * Check responses for errors
     * @param status
     * @private
     */
    app._checkAJAXResponseForErrors = function (status) {
        if (status === 0) {
            debugger;
            // todo
            this.showMessage('It seems that you don\'t have internet connection, please try again later.');
        }
    };

    /**
     * Error handler for the AJAX for JIRA projects
     * @param {Object} event
     * @param {element} ironAJAX
     * @private
     */
    app._errorHandlerForSprintsAJAX = function (event, ironAJAX) {
        debugger;
        // todo
        alert('error')
    };

    /**
     * Re write the entire scrumCardSettings object
     * That why the custom elements that depend on it will be updated,
     * without observing the sub properties
     * @private
     */
    app._updateScrumCardSettings = function () {
        let settings = this.scrumCardSettings;
        this.scrumCardSettings = null;
        this.scrumCardSettings = settings;
    };

    /**
     * Handler the response from the AJAX for JIRA projects
     * @param {Object} event
     * @param {element} ironAJAX
     * @private
     */
    app._responseHandlerForProjectsAJAX = function (event, ironAJAX) {
        this._checkAJAXResponseForErrors(ironAJAX.status);

        let projects = this.isAJAXtoGreenHopper ? this.projects.views : this.projects;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].key) {
                projects[i].value = projects[i].key;
            } else {
                projects[i].value = projects[i].id;
            }
        }

        this.editedProjects = projects;
    };

    /**
     * Handler the response from the AJAX for project sprints
     * @param {Object} event
     * @param {element} ironAJAX
     * @private
     */
    app._responseHandlerForSprintsAJAX = function (event, ironAJAX) {
        var response;
        this._checkAJAXResponseForErrors(ironAJAX.status);

        //todo
        if (ironAJAX.response === null) {
            this.editedSprints = [];
            alert('error in sprints');
            return;
        } else {
            response = ironAJAX.response.sprints ? ironAJAX.response.sprints : ironAJAX.response;
        }

        if (response.length === 0) {
            this.showMessage('There are no available sprints in this project.')
        }

        this.editedSprints = ironAJAX.response.sprints ? ironAJAX.response.sprints : ironAJAX.response;

    };

})(document);
