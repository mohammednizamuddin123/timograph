const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyUser } = require("../middleware/authmiddleware");

router.get("/", verifyUser, cartController.getCart);
router.post("/add", verifyUser, cartController.addToCart);
router.put("/update", verifyUser, cartController.updateQuantity);
router.delete("/remove/:productId", verifyUser, cartController.removeFromCart);

module.exports = router;
