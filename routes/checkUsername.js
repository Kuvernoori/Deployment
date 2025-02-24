const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/check-username', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ exists: false, message: "Username is required" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.json({ exists: true, message: "Username is already taken" });
        } else {
            return res.json({ exists: false, message: "Username is available" });
        }
    } catch (error) {
        console.error("Error checking username:", error);
        res.status(500).json({ exists: false, message: "Server error" });
    }
});

module.exports = router;
