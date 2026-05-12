const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// POST /posts
router.post("/", (req, res) => {
    const { founderId, content } = req.body;

    const founders = req.app.locals.founders;
    const posts = req.app.locals.posts;

    // Validate founderId
    if (!founderId || typeof founderId !== "string") {
        return res.status(400).json({
            error: "founderId is required",
        });
    }

    // Check whether founder exists
    const founderExists = founders.some(
        (founder) => founder.id === founderId
    );

    if (!founderExists) {
        return res.status(404).json({
            error: "Founder not found",
        });
    }

    // Validate content
    if (!content || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
            error: "Content is required",
        });
    }

    // Save to in-memory array
    const post = {
        id: crypto.randomUUID(),
        founderId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
    };
    posts.push(post);

    res.status(201).json(post);
});

// GET /posts   &&  Also filter: /posts?founderId=<id>
router.get("/", (req, res) => {
    const posts = req.app.locals.posts;
    const { founderId } = req.query;

    // If founderId is provided, filter posts
    if (founderId) {
        const filteredPosts = posts.filter(
            (post) => post.founderId === founderId
        );

        return res.status(200).json(filteredPosts);
    }

    // Otherwise return all posts
    res.status(200).json(posts);
});

module.exports = router;