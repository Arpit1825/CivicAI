const mongoose=require('mongoose')

const issueSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
category:{
    type:String,
    default:"Other"
},
imageUrl:{
    type:String,
   default:""
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
longitude:{
    type:Number,
    required:true
},
latitude:{
    type:Number,
    required:true

},location: {
  type: {
    type: String,
    default: "Point"
  },
  coordinates: [Number]
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

issueSchema.index({
    location: "2dsphere"
});

module.exports=mongoose.model("Issue",issueSchema);