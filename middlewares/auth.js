const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({message: "Access Denied"});
    }

    try {
        console.log('Received token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ['HS256']});
        console.log('Decoded User:', decoded);
        req.user = {userId : decoded.userId};
        next()
    } catch (err) {
        console.error("Invalid Token:", err);
        res.status(400).json({message: "Invalid Token"});
    }
};

module.exports = verifyToken;
