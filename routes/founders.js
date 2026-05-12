const express = require("express");
const crypto = require("crypto");

const router = express.Router();

function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// POST /founders
router.post("/", (req, res) => {
    const { name, email, role, sectors = [] } = req.body;

    // Validate name
    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            error: "Name is required",
        });
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            error: "Valid email is required",
        });
    }

    // Validate role
    if (!role || !["founder", "investor"].includes(role)) {
        return res.status(400).json({
            error: 'Role must be either "founder" or "investor"',
        });
    }

    // Validate sectors
    if (!Array.isArray(sectors)) {
        return res.status(400).json({
            error: "Sectors must be an array",
        });
    }

    // Save to in-memory array
    const founder = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        sectors,
        createdAt: new Date().toISOString(),
    };
    req.app.locals.founders.push(founder);

    res.status(201).json(founder);
});

// GET /founders
router.get("/", (req, res) => {
    res.status(200).json(req.app.locals.founders);
});

module.exports = router;