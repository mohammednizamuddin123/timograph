// models/Product.js

const mongoose =require("mongoose")

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Analog", "Digital","Smart-Watch","Luxury","Sports","Chronograph","Automatic"],
    },

    // Pricing & Inventory
    price: {
      type: Number,
      required: true,
      min: 0,
    }, 

    offer: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Product Image
    image: {
      type: String,
      required: true,
    },

    imgOrg: {
      type: String,
      enum: ["url", "file"],
      required: true,
    },

    // Product Status
    featured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    featuredOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports= Product;