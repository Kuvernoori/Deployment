const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/check-email', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ exists: false, message: "Email is required" });

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ exists: true, message: "Email is already registered" });
        } else {
            return res.json({ exists: false, message: "Email is available" });
        }
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ exists: false, message: "Server error" });
    }
});

module.exports = router;
