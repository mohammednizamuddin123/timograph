const{connection}=require("./config/db")
const express= require("express")
const cors= require("cors")
const cookieParser = require("cookie-parser")

const userRoutes=require("./routes/userRoutes")
const adminRoutes=require("./routes/adminRoutes")
const cartRoutes=require("./routes/cartRoutes")
const orderRoutes=require("./routes/orderRoutes")
require("dotenv").config()
const PORT=process.env.PORT
const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static("uploads"))
connection()
app.use("/users",userRoutes)
app.use("/admin",adminRoutes)
app.use("/users/cart", cartRoutes)
app.use("/users/order", orderRoutes)
app.post("/",(req,res)=>{
    res.send("working")
})

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
    
})