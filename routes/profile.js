const express = require("express");
const User = require("../models/User");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const bcrypt = require("bcrypt");

router.get("/me", verifyToken, async (req, res) => {
    try {
        console.log("Looking for user with ID:", req.user.userId);
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({userId: user._id, username: user.username, email: user.email, gender: user.gender, age: user.age});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

router.put("/update", verifyToken, async (req, res) => {
    try {
        const {gender, age} = req.body;

        if (!gender && !age) {
            return res.status(400).json({message: "No information to update"});
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (gender) {
            user.gender = gender;
        }
        if (age) {
            user.age = age;
        }

        await user.save();

        res.json({message: "User information updated successfully!"});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Server error"});
    }
});

router.put("/change-name", verifyToken, async (req, res) => {
    const {newUsername} = req.body;

    if (!newUsername) {
        return res.status(400).json({message: "Name is required"});
    }

    try {
        const existingUser = await User.findOne({username: newUsername});
        if (existingUser) {
            return res.status(400).json({message: "Username is already taken"});
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.username = newUsername;
        await user.save();

        res.json({message: "Name updated successfully!"});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

router.put("/change-email", verifyToken, async (req, res) => {
    const {newEmail} = req.body;

    if (!newEmail) {
        return res.status(400).json({message: "Email is required"});
    }

    try {
        const existingEmail = await User.findOne({email: newEmail});
        if (existingEmail) {
            return res.status(400).json({message: "Email is already in use"});
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.email = newEmail;
        await user.save();

        res.json({message: "Email updated successfully!"});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

router.post("/check-current-password", verifyToken, async (req, res) => {
    const {currentPassword} = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({error: "Incorrect password"});
        }

        return res.status(200).json({message: "Password is correct"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: "Internal server error"});
    }
});

router.put("/change-password", verifyToken, async (req, res) => {
    const {newPassword} = req.body;

    if (!newPassword) {
        return res.status(400).json({message: "Password is required"});
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({message: "Password updated successfully!"});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;
