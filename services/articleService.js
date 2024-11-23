const {JSDOM} = require("jsdom");
const TEST_HTML = require("./testHTML.js");
const parser = require("./utils/parser.js");
const extractor = require("./utils/extractor.js");

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

function getArticleText(title) {
    // const rawHtml = await getArticleHTML(title);
    const rawHtml = TEST_HTML;
    console.log(`rawHtml -> ${rawHtml}`)
    const dom = new JSDOM(rawHtml);
    const contentElement = dom.window.document.querySelector(".mw-content-ltr");
    const articleText = parser.parseText(contentElement);
    console.log(`parsed string length: ${articleText.length}`);

    return articleText;
}


function getNumberOfWords(title) {
    // const rawHtml = await getArticleHTML(title);
    const rawHtml = TEST_HTML;
    const articleText = getArticleText(rawHtml);
    const articleTextList = extractor.extractArticleWords(articleText);

    return articleTextList.length;
}


module.exports = { getArticleHTML, getArticleText, getNumberOfWords };