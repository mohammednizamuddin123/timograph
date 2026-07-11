const mongoose=require("mongoose")
function connection(){
    const mongoURI = process.env.MONGO_URI;
    mongoose.connect(mongoURI)
.then(()=>{
    console.log("Database Connected");
    
})
.catch(err=>{
    console.log(err);
    
})
}
module.exports={connection}