chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: 'chrome-extension://' + chrome.app.getDetails().id + '/index.html#!/home'
    });
    chrome.browserAction.setBadgeText({text: ''});
});

chrome.runtime.onInstalled.addListener(function (details) {
    var isVersionUpdated = chrome.runtime.getManifest().version.split('.')[2] === '0';
    if (details.reason === 'update' && isVersionUpdated) {
        chrome.browserAction.setBadgeText({text: 'New'});
    }
});
