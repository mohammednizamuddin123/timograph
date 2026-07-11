const fs = require("fs/promises");
const Product = require("../models/Product")
async function addProduct(req, res) {
    console.log("hi");

    try {
        const { fromFile } = req.body;
        const imgOrg = req.body.imgOrg;
        if (imgOrg === "url") {
            req.body.image = req.body.imageUrl;
        } else {
            req.body.image = req.file.path;
        }

        const {
            name,
            brand,
            category,
            price,
            offer,
            stock,
            image,
            featured,
            featuredOrder,
            isAvailable
        } = req.body;

        const formData = {
            name,
            brand,
            category,
            price,
            offer,
            stock,
            description,
            image,
            imgOrg,
            featured,
            featuredOrder,
            isAvailable
        };

        const add = await Product.create(formData);

        res.status(201).json({
            message: "Product added successfully",
            isAdded: true,
            product: add
        });

    } catch (error) {
        console.log(error.message);

        // Delete uploaded file if it exists
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
                console.log("Uploaded file removed");
            } catch (unlinkError) {
                console.log("File deletion failed:", unlinkError.message);
            }
        }

        res.status(500).json({
            message: error.message,
            isAdded: false
        });
    }
}

async function getProducts(req, res) {
    console.log("it is working")
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function editProduct(req, res) {
    try {
        const { id } = req.params;
        const imgOrg = req.body.imgOrg;

        const updateData = { ...req.body };

        if (imgOrg === "file") {
            if (req.file) {
                updateData.image = req.file.path;
            }
        } else if (imgOrg === "url") {
            if (req.body.imageUrl) {
                updateData.image = req.body.imageUrl;
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

        if (!updatedProduct) {
            return res.status(404).json({ isUpdated: false, message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            isUpdated: true,
            product: updatedProduct
        });

    } catch (error) {
        if (req.file?.path) {
            try { await fs.unlink(req.file.path); } catch (e) {}
        }
        res.status(500).json({ isUpdated: false, message: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ isDeleted: false, message: "Product not found" });
        }

        if (deletedProduct.imgOrg === "file" && deletedProduct.image) {
            try {
                await fs.unlink(deletedProduct.image);
            } catch (err) {
                console.log("Failed to delete product image file:", err.message);
            }
        }

        res.status(200).json({
            message: "Product deleted successfully",
            isDeleted: true
        });

    } catch (error) {
        res.status(500).json({ isDeleted: false, message: error.message });
    }
}

async function getFeaturedProducts(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 8;
        
        const featuredProducts = await Product.find({ featured: true, isAvailable: true })
            .sort({ featuredOrder: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            products: featuredProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getPublicProducts(req, res) {
    try {
        const { search, category, brand, minPrice, maxPrice, minOffer, maxOffer } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Base filter: only available products
        let filter = { isAvailable: true };

        // Search text (matches name or description)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Category match
        if (category) {
            filter.category = category;
        }

        // Brand match
        if (brand) {
            filter.brand = { $in: brand.split(",") }; // allow multiple brands comma-separated
        }

        // Price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Offer range
        if (minOffer || maxOffer) {
            filter.offer = {};
            if (minOffer) filter.offer.$gte = Number(minOffer);
            if (maxOffer) filter.offer.$lte = Number(maxOffer);
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getUniqueBrands(req, res) {
    try {
        const brands = await Product.distinct("brand", { isAvailable: true });
        res.status(200).json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getCollections(req, res) {
    try {
        const collections = await Product.aggregate([
            { $match: { isAvailable: true } },
            { 
                $group: { 
                    _id: "$category", 
                    count: { $sum: 1 },
                    image: { $first: "$image" },
                    imgOrg: { $first: "$imgOrg" }
                } 
            },
            { $sort: { _id: 1 } } // Sort categories alphabetically
        ]);

        res.status(200).json({ success: true, collections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.isAvailable) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid product ID or server error" });
    }
}

module.exports = { addProduct, getProducts, editProduct, deleteProduct, getFeaturedProducts, getPublicProducts, getUniqueBrands, getCollections, getProductById }