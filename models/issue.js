const mongoose=require('mongoose')

const issueSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
category:{
    type:String,
    required:true
},
imageUrl:{
    type:String,
    required:true
},
aiSummary:{
    type:String
},
severity:{
type:String,
 enum:["Low","Medium","High","Critical"]
},
priorityScore:{
    type:Number,
    default:1
},
latitude:{
    type:Number,
    required:true

},
longitude:{
    type:Number,
    required:true
},
reportsCount:{
    type:Number,
    default:1
},
reporters:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
],
status:{
    type:String,
    enum:["Reported","Verified","In Progress","Resolved"],
    default:"Reported"
},
createdBy:{
    type:mongoose.Schema.Types.ObjectId
    ,ref:"User",
    required:true
}},{
    timestamps:true
})

module.exports=mongoose.model("Issue",issueSchema);