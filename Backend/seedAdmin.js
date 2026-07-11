const readline = require("readline");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const { connection } = require("./config/db");
const User = require("./models/User");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function seedAdmin() {
    try {
        console.log("--- Interactive Admin Seed Script ---");
        
        // Connect to MongoDB
        await connection();
        console.log("Connected to database successfully.\n");

        const name = await askQuestion("Enter Admin Name (min 3 chars): ");
        const email = await askQuestion("Enter Admin Email: ");
        const password = await askQuestion("Enter Admin Password (min 6 chars): ");

        if (name.length < 3 || password.length < 6 || !email.includes("@")) {
            console.log("\n[ERROR] Invalid input. Please ensure name >= 3 chars, password >= 6 chars, and a valid email.");
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log(`\n[ERROR] A user with email ${email} already exists.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log(`\n[SUCCESS] Admin user '${newAdmin.name}' created successfully!`);
        process.exit(0);

    } catch (error) {
        console.error("\n[FATAL ERROR]", error.message);
        process.exit(1);
    }
}

seedAdmin();
