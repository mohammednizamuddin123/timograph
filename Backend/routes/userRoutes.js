const express=require("express")
const router=express.Router()
const userController= require("../controllers/userController")
const bannerController= require("../controllers/bannerController")
const productController = require("../controllers/productController")
const brandController = require("../controllers/brandController")

router.get("/",userController.getUser)
router.post("/register",userController.postUser)
router.post("/login",userController.login)
router.get("/banners", bannerController.getBanners)
router.get("/products/featured", productController.getFeaturedProducts)
router.get("/products/brands", productController.getUniqueBrands)
router.get("/products", productController.getPublicProducts)
router.get("/products/:id", productController.getProductById)
router.get("/collections", productController.getCollections)
router.get("/brands", brandController.getPublicBrands)

module.exports= router