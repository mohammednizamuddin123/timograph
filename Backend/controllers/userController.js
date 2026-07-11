const User = require("../models/User")
const Order = require("../models/Order")
const Product = require("../models/Product")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

async function getUser(req, res) {
    res.send("user fetched")
}

async function postUser(req, res) {
    try {
        const user = req.body;
        
        // Enforce user role for registration
        user.role = "user";

        const password = await bcrypt.hash(user.password, 10);
        user.password = password
        const isEmail = await User.findOne({ email: user.email })

        if (isEmail) {
            return res.status(400).json({ message: "Email already exist", isRegistered: false, isEmail: true })
        }

        // Generate a secure session token for Auto-Login
        const sessionToken = crypto.randomBytes(32).toString("hex");
        user.sessionToken = sessionToken;

        const result = await User.create(user)
        
        // Set the auth cookie immediately
        res.cookie("userToken", sessionToken, { 
            httpOnly: true, 
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ 
            message: "User Registered successfully", 
            isEmail: false, 
            isRegistered: true,
            role: result.role
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message, isRegistered: false, isEmail: false })
    }
}

//LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: "This user account not found", isLogin: false })
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", isLogin: false });
        }

        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString("hex");
        existingUser.sessionToken = sessionToken;
        await existingUser.save();

        const cookieName = existingUser.role === "admin" ? "adminToken" : "userToken";
        
        res.cookie(cookieName, sessionToken, { 
            httpOnly: true, 
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({ message: "Login Success", isLogin: true, role: existingUser.role });
        
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message, isLogin: false });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password").sort("-createdAt");
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

async function getDashboardStats(req, res) {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find({ status: { $ne: "Cancelled" } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.status(200).json({
            success: true,
            stats: {
                revenue: totalRevenue,
                orders: totalOrders,
                users: totalUsers,
                products: totalProducts
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = { getUser, postUser, login, getAllUsers, getDashboardStats }