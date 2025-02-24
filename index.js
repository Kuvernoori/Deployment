require('dotenv').config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const signUpRoutes = require("./routes/signup");
const checkEmail = require("./routes/checkEmail");
const checkUsername = require("./routes/checkUsername");
const loginRoutes = require("./routes/login");
const searchRoutes = require("./routes/searchCars");
const carRoutes = require("./routes/filtration");
const userRoutes = require("./routes/getUser");
const adsRoutes = require("./routes/ads");
const profileRoutes = require("./routes/profile");
const checkEmailProfile = require("./routes/checkEmailProfile");
const checkUsernameProfile = require("./routes/checkUsernameProfile")
const reviewRoutes = require("./routes/reviews")

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({error: "Invalid JSON format"});
    }
    next();
});

app.use(express.static(path.join(__dirname, "templates")));
app.use(express.static(path.join(__dirname, "static")));
app.use("/images", express.static(path.join(__dirname, "images")));


const serveHTML = (req, res, filePath) => {
    res.sendFile(path.join(__dirname, "templates", filePath));
};

app.get("/", (req, res) => serveHTML(req, res, "index.html"));
app.get("/templates/authentication/signup.html", (req, res) => serveHTML(req, res, "authentication/signup.html"));
app.get("/templates/authentication/login.html", (req, res) => serveHTML(req, res, "authentication/login.html"));
app.get("/templates/cartrading/withlogout.html", (req, res) => serveHTML(req, res, "cartrading/withlogout.html"));
app.get("/templates/cartrading/myAds.html", (req, res) => serveHTML(req, res, "cartrading/myAds.html"));
app.get("/templates/cartrading/profile.html", (req, res) => serveHTML(req, res, "cartrading/profile.html"));
app.get("/templates/cartrading/reviewExample.html", (req, res) => serveHTML(req, res, "cartrading/reviewExample.html"));
app.get("/templates/index.html", (req, res) => serveHTML(req, res, "index.html"));


app.use("/api/auth", signUpRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/check", checkUsername);
app.use("/api/check", checkEmail);
app.use("/api", searchRoutes);
app.use("/api/cars", carRoutes);
app.use("/api", userRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/user", checkEmailProfile);
app.use("/api/user", checkUsernameProfile)
app.use("/api", reviewRoutes);

app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
