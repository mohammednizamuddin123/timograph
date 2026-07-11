const mongoose=require("mongoose")
function connection(){
    mongoose.connect("mongodb://localhost:27017/website")
.then(()=>{
    console.log("Database Connected");
    
})
.catch(err=>{
    console.log(err);
    
})
}
module.exports={connection}