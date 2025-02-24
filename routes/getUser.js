const express = require("express");
const jwt = require("jsonwebtoken");
const GetUser = require("../models/User");
const router = express.Router();

router.get("/user", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await GetUser.findById(userId).select("username");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ username: user.username });

    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
