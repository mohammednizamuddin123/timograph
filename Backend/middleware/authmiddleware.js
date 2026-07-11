const User = require("../models/User");

async function verifyAdmin(req, res, next) {
    try {
        const token = req.cookies.adminToken;
        if (!token) {
            return res.status(401).json({ message: "Authentication failed. Please log in as an Admin.", isAuth: false });
        }

        const adminUser = await User.findOne({ sessionToken: token, role: "admin" });
        if (!adminUser) {
            return res.status(401).json({ message: "Invalid or expired session. Please log in again.", isAuth: false });
        }

        req.user = adminUser;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ message: "Server error during authentication.", isAuth: false });
    }
}

async function verifyUser(req, res, next) {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(401).json({ message: "Authentication failed. Please log in.", isAuth: false });
        }

        const user = await User.findOne({ sessionToken: token, role: "user" });
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired session. Please log in again.", isAuth: false });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(500).json({ message: "Server error during authentication.", isAuth: false });
    }
}

module.exports = { verifyAdmin, verifyUser };