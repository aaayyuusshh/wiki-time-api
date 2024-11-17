require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🎧 server listening on port ${PORT}`);
})

// routes
app.get("/", (req, res) => {
    res.send("hello from WikiTime api!");
});