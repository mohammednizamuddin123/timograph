const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyUser } = require("../middleware/authmiddleware");

router.post("/place", verifyUser, orderController.placeOrder);
router.get("/", verifyUser, orderController.getOrders);

module.exports = router;
