chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: "chrome-extension://mbkgkdflhiaamohkeicabcpglogajbgd/"
    }); // TODO change when it is public
});
