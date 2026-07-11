const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20, minlength: 3, trim: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, trim: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zip: { type: String, trim: true }
    },
    sessionToken: { type: String }
}, { timestamps: true })

const User = mongoose.model("users", userSchema)
module.exports = User;