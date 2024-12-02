require("dotenv").config();
const express = require("express");
const articleRoutes = require("./routes/articleRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🎧 server listening on port ${PORT}`);
})

// root route
app.get("/", (req, res) => {
    res.send("hello from WikiTime api!");
});

app.use("/api", articleRoutes);

// catch all middleware
app.use((req, res) => {
    res.status(404).json({
        error: "404 Endpoint not found."
    });
});

app.use(errorHandler);
