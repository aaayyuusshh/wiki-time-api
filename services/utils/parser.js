const ParserModule = (function () {
    let imageCount = 0;

    function resetImageCount() {
        imageCount = 0;
    }

    function isReferencesSection(node) {
        return (
            node.nodeType === node.ELEMENT_NODE &&
            node.className.includes("mw-heading") &&
            node.firstChild.nodeType === node.ELEMENT_NODE &&
            ["References", "Citations", "Notes", "See_also"].includes(node.firstChild.getAttribute("id"))
        );
    }

    function isDisplayNone(node) {
        const nodeDisplayStyle = node.style?.display;
        return nodeDisplayStyle === "none";
    }

    function isInvalidTag(node) {
        const nodeHtmlTag = node.nodeName.toLowerCase();
        return ["style", "script"].includes(nodeHtmlTag);
    }

    function isBracketReferences(node) {
        return node.nodeName.toLowerCase() === "sup" && node.classList.contains("reference");
    }

    function isEditSection(node) {
        return node.classList?.contains("mw-editsection");
    }

    function isExplorableNode(node) {
        return !isDisplayNone(node) && !isInvalidTag(node) && !isBracketReferences(node) && !isEditSection(node);
    }

    function isImage(node) {
        return node.nodeName.toLowerCase() === "img";
    }

    function incrementImageCount() {
        imageCount++;
    }

    function getImageCount() {
        return imageCount;
    }

    function parseText(node) {
        let text = "";
        if (node.nodeType === node.TEXT_NODE) {
            text += node.textContent;
        } else if (node.nodeType === node.ELEMENT_NODE) {
            if (isImage(node)) {
                incrementImageCount();
            }
            for (let childNode of node.childNodes) {
                if (isReferencesSection(childNode)) {
                    break;
                }
                if (isExplorableNode(childNode)) {
                    text += " " + parseText(childNode);
                }
            }
        }
        return text;
    }

    return {
        parseText,
        getImageCount,
        resetImageCount
    };
})();


module.exports = ParserModule;