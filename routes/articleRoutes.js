const express = require("express");
const articleService = require("../services/articleService.js");

const router = express.Router();

router.get("/words/:title", async (req, res, next) => {
    const title = req.params.title;
    try {
        const numOfWords = await articleService.getNumberOfWords(title);
        res.status(200).json({
            title,
            numOfWords
         });
    } catch (error) {
       next(error);
    }
});

router.get("/images/:title", async (req, res, next) => {
    const title = req.params.title;
    try {
        const numOfImages = await articleService.getNumberOfImages(title);
        res.status(200).json({
           title,
           numOfImages
        });
    } catch (error) {
        next(error);
    }
});

router.get("/reading-time/:title", async (req, res, next) => {
    const title = req.params.title;
    try {
        const readingTime = await articleService.getReadingTime(title);
        res.status(200).json({
           title,
           readingTime
        });
    } catch (error) {
        next(error);
    }
});

router.get("/info/:title", (req, res, next) => {
    res.status(200).json({
        "title": req.params.title,
        "info": "not sure how to structure this yet"
    });
});

module.exports = router;
