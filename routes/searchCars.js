const express = require("express");
const router = express.Router();
const Car = require("../models/cars");

router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Please enter a car name for search." });
        }

        const cars = await Car.find({ name: { $regex: new RegExp(name, "i") } });

        if (cars.length === 0) {
            console.log("No cars found.");
            return res.status(404).json({ message: "Car not found" });
        }

        console.log(`Found ${cars.length} cars.`);
        res.json(cars);
    } catch (error) {
        console.error("Error searching for cars:", error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
