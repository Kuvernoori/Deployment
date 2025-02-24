const express = require("express");
const Car = require("../models/cars");
const router = express.Router();
const verifyToken = require("../middlewares/auth");


router.post("/", verifyToken, async (req, res) => {
    try {
        const { name, year, color, description, seller } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "default_car.jpg";

        const newCar = new Car({ name, year, color, description, seller, image, rating: 5 });
        await newCar.save();

        res.status(201).json(newCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating ad" });
    }
});

router.get("/api/ads", verifyToken, async (req, res) => {
    try {
        let query = {};
        if (req.query.seller) {
            query.seller = req.query.seller;
        }

        const ads = await Ad.find(query);
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: "Error fetching ads" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: "Ad deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting ad" });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { name, year, color, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            { name, year, color, description, ...(image && { image }) },
            { new: true }
        );

        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: "Error updating ad" });
    }
});

module.exports = router;
