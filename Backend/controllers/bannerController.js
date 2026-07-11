const fs = require("fs/promises");
const Banner = require("../models/Banner");

async function addBanner(req, res) {
    try {
        const imgOrg = req.body.imgOrg;
        if (imgOrg === "url") {
            req.body.image = req.body.imageUrl;
        } else {
            req.body.image = req.file.path;
        }

        const {
            title,
            subtitle,
            image,
            link,
            isActive,
            order
        } = req.body;

        const formData = {
            title,
            subtitle,
            image,
            imgOrg,
            link,
            isActive,
            order
        };

        const add = await Banner.create(formData);

        res.status(201).json({
            message: "Banner added successfully",
            isAdded: true,
            banner: add
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

async function getBanners(req, res) {
    try {
        // Optional: filter by active status for the frontend
        const filter = {};
        if (req.query.active === 'true') {
            filter.isActive = true;
        }

        const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 }).lean();

        res.status(200).json({
            success: true,
            banners
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function editBanner(req, res) {
    try {
        const { id } = req.params;
        const imgOrg = req.body.imgOrg;

        const updateData = { ...req.body };

        // Handle image updates
        if (imgOrg === "file" && req.file) {
            updateData.image = req.file.path;
        } else if (imgOrg === "url" && req.body.imageUrl) {
            updateData.image = req.body.imageUrl;
        }

        const oldBanner = await Banner.findById(id);
        if (!oldBanner) {
             return res.status(404).json({ isUpdated: false, message: "Banner not found" });
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

        // If the new image is a file, or if we switched to url, delete the old file if it was a file
        if (oldBanner.imgOrg === "file" && oldBanner.image !== updatedBanner.image && oldBanner.image) {
             try { await fs.unlink(oldBanner.image); } catch (e) { console.log("Failed to delete old banner image:", e.message); }
        }

        res.status(200).json({
            message: "Banner updated successfully",
            isUpdated: true,
            banner: updatedBanner
        });

    } catch (error) {
        if (req.file?.path) {
            try { await fs.unlink(req.file.path); } catch (e) {}
        }
        res.status(500).json({ isUpdated: false, message: error.message });
    }
}

async function deleteBanner(req, res) {
    try {
        const { id } = req.params;
        const deletedBanner = await Banner.findByIdAndDelete(id);

        if (!deletedBanner) {
            return res.status(404).json({ isDeleted: false, message: "Banner not found" });
        }

        if (deletedBanner.imgOrg === "file" && deletedBanner.image) {
            try {
                await fs.unlink(deletedBanner.image);
            } catch (err) {
                console.log("Failed to delete banner image file:", err.message);
            }
        }

        res.status(200).json({
            message: "Banner deleted successfully",
            isDeleted: true
        });

    } catch (error) {
        res.status(500).json({ isDeleted: false, message: error.message });
    }
}

module.exports = { addBanner, getBanners, editBanner, deleteBanner };
