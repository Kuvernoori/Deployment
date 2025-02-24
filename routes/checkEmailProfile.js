const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middlewares/auth.js");

const router = express.Router();

router.post("/check-email", verifyToken, async (req, res) => {
    const { newEmail } = req.body;
    try {
        const user = await User.findOne({ email: newEmail });
        if (user) {
            return res.json({ exists: true });
        }
        return res.json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
