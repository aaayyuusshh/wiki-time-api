const {JSDOM} = require("jsdom");
const TEST_HTML = require("./testHTML.js");
const parser = require("./utils/parser.js");
const extractor = require("./utils/extractor.js");
const timeCalculator = require("./utils/timeCalculator.js");
const ApiError = require("./utils/ApiError.js");
const redisClient = require("../cache/redisClient.js");

async function getArticleHTML(title) {
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

async function getParsedData(title) {
    // try to get computed values from cache frist
    const cacheKey = `wiki:parsed:${title.toLowerCase()}`;
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData) {
        console.log(`🔁 [CACHE HIT] Parsed data for "${title}"`);
        return JSON.parse(cachedData);
    }

    // not cached? get raw html, parse, and compute values
    const rawHtml = await getArticleHTML(title);
    // const rawHtml = TEST_HTML;
    const dom = new JSDOM(rawHtml);
    const contentElement = dom.window.document.querySelector(".mw-content-ltr");
    
    parser.resetImageCount();
    const articleText = parser.parseText(contentElement);
    const numOfImages = parser.getImageCount(); 
    const numOfWords = extractor.extractArticleWords(articleText).length;
    const readingTime = timeCalculator.calculateReadingTime(numOfWords, numOfImages);

    const parsedResult = {
        articleText,
        numOfImages,
        numOfWords,
        readingTime
    };

    // cache computed results in Redis for 24hrs
    await redisClient.setEx(cacheKey, 86400, JSON.stringify(parsedResult));
    console.log(`❌ [CACHE MISS] Cached parsed data for "${title}"`);
   
    return parsedResult;
}

async function getArticleText(title) {
    const {articleText} = await getParsedData(title);
    return articleText;
}

async function getNumberOfImages(title) {
    const {numOfImages} = await getParsedData(title);
    return numOfImages;
}

async function getNumberOfWords(title) {
    const {numOfWords} = await getParsedData(title);
    return numOfWords;
}

async function getReadingTime(title) {
    const {readingTime} = await getParsedData(title);
    return readingTime;
}

module.exports = { getArticleHTML, getArticleText, getNumberOfImages, getNumberOfWords, getReadingTime };
