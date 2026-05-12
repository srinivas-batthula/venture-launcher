const express = require("express");
const foundersRouter = require("./routes/founders");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = 8080;

app.use(express.json());

// In-memory data storage (shared across routes)
const founders = [];
const posts = [];

// Makes arrays available to all routes...
app.locals.founders = founders;
app.locals.posts = posts;

// Routes
app.use("/founders", foundersRouter);
app.use("/posts", postsRouter);

// Handle Unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});