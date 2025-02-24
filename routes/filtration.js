const express = require("express");
const Car = require("../models/cars");

const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        const cars = await Car.find();
        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found" });
        }
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
