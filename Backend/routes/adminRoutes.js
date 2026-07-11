const express=require("express")
const productController=require("../controllers/productController")
const bannerController=require("../controllers/bannerController")
const brandController = require('../controllers/brandController')
const orderController = require('../controllers/orderController')
const userController = require('../controllers/userController')
const upload=require("../middleware/multer")
const { verifyAdmin } = require("../middleware/authmiddleware")
const router=express.Router()

// Apply verifyAdmin middleware to all admin routes
router.use(verifyAdmin);

router.post("/addProduct",upload.single("image"),productController.addProduct)
router.get("/products", productController.getProducts)
router.put("/editProduct/:id", upload.single("image"), productController.editProduct)
router.delete("/deleteProduct/:id", productController.deleteProduct)

// Banner routes
router.post("/addBanner", upload.single("image"), bannerController.addBanner)
router.get("/banners", bannerController.getBanners)
router.put("/editBanner/:id", upload.single("image"), bannerController.editBanner)
router.delete("/deleteBanner/:id", bannerController.deleteBanner)

// Brand Routes
router.post("/addBrand", brandController.addBrand);
router.get("/getBrands", brandController.getBrands);
router.put("/editBrand/:id", brandController.editBrand);
router.delete("/deleteBrand/:id", brandController.deleteBrand);

// Order routes
router.get("/orders", orderController.getAllOrders);
router.put("/order/:id/status", orderController.updateOrderStatus);

// User routes
router.get("/users", userController.getAllUsers);

// Dashboard routes
router.get("/dashboard-stats", userController.getDashboardStats);

module.exports = router