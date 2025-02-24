const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    seller: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    description: { type: String, required: true },
    image: { type: String, default: "default_car.jpg" }
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
