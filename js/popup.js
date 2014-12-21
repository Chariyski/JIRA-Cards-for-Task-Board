// JS logic after the popup is loaded
window.addEventListener('load', function (evt) {
    var addButton = document.getElementById('add');
    var removeButton = document.getElementById('delete');

    /**
     * Create the needed tags
     */
    addButton.onclick = function () {
        chrome.runtime.getBackgroundPage(function (eventPage) {
            eventPage.createScrumCards();
        });
    };

    /**
     * Delete the created tags
     */
    removeButton.onclick = function () {
        chrome.runtime.getBackgroundPage(function (eventPage) {
            eventPage.deleteScrumCards();
        });
    };
});