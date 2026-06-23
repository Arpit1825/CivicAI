const mongoose=require("mongoose");

const connectDB = async ()=>{
    try{ 
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo DB successfully connected ");
      console.log(
        "DB:",
        mongoose.connection.db.databaseName
    );
}catch(err){
console.log(" An error occurred :",err.message);
process.exit(1);
}
}

module.exports=connectDB;