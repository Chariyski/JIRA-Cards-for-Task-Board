/**
 * Delete DOM element
 */
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

/**
 * Delete all tags that are created from this extension
 */
(function () {
    var scrumCardWrapper = document.getElementById('scrumCardWrapper');
    var scrumCardTemplateCSS = document.getElementById('scrumCardTemplateCSS');

    if (scrumCardWrapper) {
        document.getElementById('scrumCardWrapper').remove();
    }
    if (scrumCardTemplateCSS) {
        document.getElementById('scrumCardTemplateCSS').remove();
    }
}());