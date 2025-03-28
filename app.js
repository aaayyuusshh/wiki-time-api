require("dotenv").config();
const express = require("express");
const articleRoutes = require("./routes/articleRoutes");
const errorHandler = require("./middlewares/errorHandler");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🎧 server listening on port ${PORT}`);
})

// basic rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

// apply limiter to all requests
app.use(limiter);

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
