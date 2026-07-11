const mongoose=require("mongoose")
function connection(){
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/website";
    mongoose.connect(mongoURI)
.then(()=>{
    console.log("Database Connected");
    
})
.catch(err=>{
    console.log(err);
    
})
}
module.exports={connection}