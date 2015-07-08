(function (document) {
    'use strict';


    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    app.displayInstalledToast = function () {
        document.querySelector('#caching-complete').show();
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function () {
        console.log('Our app is ready to rock!');
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function () {
        // imports are loaded and elements have been registered
    });

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onMenuSelect = function () {
        let drawerPanel = document.querySelector('#paperDrawerPanel');
        if (drawerPanel.narrow) {
            drawerPanel.closeDrawer();
        }
    };

    app.getJIRAIssues = function () {
        let scrumCardsContainer = app.$['scrum-cards-container'].$,
            url = app.$['JIRA-URL-address'].value,
            project = app.$['JIRA-project'].value,
            version = app.$['JIRA-project-version'].value,
            AJAXForJIRAIssues = document.querySelector('#ajax-for-issues');

        AJAXForJIRAIssues.url = url + '/rest/api/2/search?jql=project=' + project + '+and+fixVersion=' + version + '&&maxResults=500';

        AJAXForJIRAIssues.generateRequest();
    };

    app.onJIRAIssuesRequest = function () {
        document.querySelector('#ajax-spinner').active = true;
    };

    app.onJIRAIssuesResponse = function () {
        document.querySelector('#ajax-spinner').active = false;
    };

})(document);
