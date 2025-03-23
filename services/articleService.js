const {JSDOM} = require("jsdom");
const TEST_HTML = require("./testHTML.js");
const parser = require("./utils/parser.js");
const extractor = require("./utils/extractor.js");
const timeCalculator = require("./utils/timeCalculator.js");
const ApiError = require("./utils/ApiError.js");
const redisClient = require("../cache/redisClient.js");

async function getArticleHTML(title) {
    const cacheKey = `wiki:html:${title.toLowerCase()}`;

    // try redis cache first
    const cachedHTML = await redisClient.get(cacheKey);
    if(cachedHTML) {
        console.log(`🔁 [CACHE HIT] Wikipedia article "${title}"`);
        return cachedHTML;
    }

    // make external call if not in cache
    const url = "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
        origin: "*",
        action: "parse",
        page: title, 
        format: "json",
        prop: "text"
    });

    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new ApiError(
                `Wikipedia API returned HTTP error: ${response.statusText}`,
                response.status);
        }

        const json = await response.json();
        if(isErrorResponse(json)) {
            throw new ApiError(json.error.info, 400);
        }

        const rawHtml = json.parse.text["*"];
        if(!rawHtml) {
            throw new ApiError(
                "Article content is missing in Wikipedia API response",
                500);
        }

        // cache the raw html in redis for 24hrs
        await redisClient.setEx(cacheKey, 86400, rawHtml);
        console.log(`❌ [CACHE MISS] Cached Wikipedia article "${title}"`);

        return rawHtml;
    } catch (error){
        if(!(error instanceof ApiError)) {
            throw new ApiError(
                error.message || "An unexpected error occurred",
                500);
        }

        throw error;
    }
}

function isErrorResponse(json) {
    return json.error ? true : false;
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

async function getArticleText(title) {
    return (await parseArticleHTML(title)).articleText;
}

async function getNumberOfImages(title) {
    return (await parseArticleHTML(title)).numOfImages;
}

async function getNumberOfWords(title) {
    const articleText = await getArticleText(title);
    // console.log(articleText);
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
