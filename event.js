/**
 * Calls JS logic for created needed tags for printing.
 */
function createScrumCards() {
    chrome.tabs.executeScript({
        file: 'js/createScrumCards.js'
    });

}

/**
 * Calls JS logic for deleting the created tags, from this extension.
 */
function deleteScrumCards() {
    chrome.tabs.executeScript({
        file: 'js/deleteScrumCards.js'
    });
}