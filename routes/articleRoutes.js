const express = require("express");
const router = express.Router();

router.get("/words/:title", (req, res, next) => {
    const numOfWords = 1000;
    res.status(200).json({
        "title": req.params.title,
        "numOfWords": numOfWords
    });
});

router.get("/images/:title", (req, res, next) => {
    const numOfImages = 1;
    res.status(200).json({
        "title": req.params.title,
        "numOfImages": numOfImages
    });
});

router.get("/reading-time/:title", (req, res, next) => {
    const readingTime = 10;
    res.status(200).json({
        "title": req.params.title,
        "readingTime": readingTime
    });
});

router.get("/info/:title", (req, res, next) => {
    res.status(200).json({
        "title": req.params.title,
        "info": "not sure how to structure this yet"
    });
});


module.exports = router;