const {JSDOM} = require("jsdom");
const TEST_HTML = require("./testHTML.js");
const parser = require("./utils/parser.js");
const extractor = require("./utils/extractor.js");
const timeCalculator = require("./utils/timeCalculator.js");

async function getArticleHTML(title) {
    const url = "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
        origin: "*",
        action: "parse",
        page: title,
        format: "json",
        prop: "text"
    });
  
    const req = await fetch(url);
    const json = await req.json();
    const rawHtml = json.parse.text["*"]; 
    
    return rawHtml;
}

async function parseArticleHTML(title) {
    const rawHtml = await getArticleHTML(title);
    // const rawHtml = TEST_HTML;
    const dom = new JSDOM(rawHtml);
    const contentElement = dom.window.document.querySelector(".mw-content-ltr");
    parser.resetImageCount();
    const articleText = parser.parseText(contentElement);
    const numOfImages = parser.getImageCount();

    return { articleText, numOfImages };
}

function getArticleText(title) {
    return parseArticleHTML(title).articleText;
}

function getNumberOfImages(title) {
    return parseArticleHTML(title).numOfImages;
}

function getNumberOfWords(title) {
    // const rawHtml = await getArticleHTML(title);
    const rawHtml = TEST_HTML;
    const articleText = getArticleText(rawHtml);
    const articleTextList = extractor.extractArticleWords(articleText);

    return articleTextList.length;
}

async function getReadingTime(title) {
    const {articleText, numOfImages} = await parseArticleHTML(title);
    const numOfWords = extractor.extractArticleWords(articleText).length;
    const readingTime = timeCalculator.calculateReadingTime(numOfWords, numOfImages);
    
    return readingTime;
}

module.exports = { getArticleHTML, getArticleText, getNumberOfImages, getNumberOfWords, getReadingTime };