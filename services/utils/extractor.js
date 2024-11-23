const Extractor = (function () {
    function splitArticleText(articleText) {
        if (articleText.trim() === "") return [""];

        return articleText.split(/\s+/);
    }

    function filterNonWords(articleTextList) {
        return articleTextList.filter((elem) => {
            return elem.length > 0 && !/^[\p{P}\s]+$/u.test(elem);
        });
    }

    function extractArticleWords(articleText) {
        return filterNonWords(splitArticleText(articleText));
    }

    return {
        extractArticleWords,
        splitArticleText,
        filterNonWords
    };
})();

module.exports = Extractor