const Brand = require("../models/Brand");

// Admin: Add a new brand
async function addBrand(req, res) {
    try {
        const { name, imageUrl, priority } = req.body;
        
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingBrand) {
            return res.status(400).json({ isAdded: false, message: "Brand already exists." });
        }

        const newBrand = await Brand.create({
            name,
            imageUrl,
            priority: priority || 0
        });

        res.status(201).json({
            message: "Brand added successfully",
            isAdded: true,
            brand: newBrand
        });
    } catch (error) {
        res.status(500).json({ isAdded: false, message: error.message });
    }
}

// Admin: Get all brands
async function getBrands(req, res) {
    try {
        // Admin gets everything, sorted by priority (highest first) then creation date
        const brands = await Brand.find({}).sort({ priority: -1, createdAt: -1 });
        res.status(200).json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Admin: Edit a brand
async function editBrand(req, res) {
    try {
        const { id } = req.params;
        const { name, imageUrl, priority } = req.body;

        // Check if updating to a name that already exists (and is not the current one)
        const existingBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } });
        if (existingBrand) {
            return res.status(400).json({ isUpdated: false, message: "Another brand with this name already exists." });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            id, 
            { name, imageUrl, priority },
            { new: true } // Return updated document
        );

        if (!updatedBrand) {
            return res.status(404).json({ isUpdated: false, message: "Brand not found" });
        }

        res.status(200).json({
            message: "Brand updated successfully",
            isUpdated: true,
            brand: updatedBrand
        });
    } catch (error) {
        res.status(500).json({ isUpdated: false, message: error.message });
    }
}

// Admin: Delete a brand
async function deleteBrand(req, res) {
    try {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);

        if (!deletedBrand) {
            return res.status(404).json({ isDeleted: false, message: "Brand not found" });
        }

        res.status(200).json({
            message: "Brand deleted successfully",
            isDeleted: true
        });
    } catch (error) {
        res.status(500).json({ isDeleted: false, message: error.message });
    }
}

// Public: Get brands for user UI
async function getPublicBrands(req, res) {
    try {
        // We fetch all brands, sorted by priority highest to lowest
        const brands = await Brand.find({}).sort({ priority: -1, createdAt: -1 }).lean();
        res.status(200).json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { addBrand, getBrands, editBrand, deleteBrand, getPublicBrands };
