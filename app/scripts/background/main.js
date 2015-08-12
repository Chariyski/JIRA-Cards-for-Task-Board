chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: "chrome-extension://" + chrome.app.getDetails().id + "/home"
    });
});
