const TimeCalculator = (function () {
    const SECONDS_PER_IMAGE = 2;
    const WORDS_PER_MINUTE = 300;

    function calculateTextReadingTime(list) {
        return list / WORDS_PER_MINUTE;
    }

    function calculateImageReadingTime(numOfImages) {
        let imagesTimeInSeconds = numOfImages * SECONDS_PER_IMAGE;
        return imagesTimeInSeconds / 60;
    }

    function calculateReadingTime(list, numOfImages) {
        return Math.ceil((calculateTextReadingTime(list)) + calculateImageReadingTime(numOfImages));
    }

    return {
        calculateReadingTime,
    };
})();

module.exports = TimeCalculator