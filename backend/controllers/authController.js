const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User=require('../models/User');

const signup= async (req,res)=>{
const {name,email,password,role,adminSecretKey}=req.body;
try{
    const user=await User.findOne({email})

if(user){
   return res.status(409).json({
    success:false,
    message:"User already exists"
   });
}
if(role==="Admin"){
   if(adminSecretKey !== process.env.ADMIN_SECRET_KEY){
      return res.status(403).json({
         success:false,
         message:"Invalid Admin Secret Key"
      });
   }
}
let hash = await bcrypt.hash(password,10);

let createuser = await User.create({
    name,email,password:hash,role
})

const token=jwt.sign({email:createuser.email,
    id:createuser._id},
    JWT_SECRET,{
        expiresIn:"7d"
    });

res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    maxAge:7*24*60*60*1000
});

return res.status(201).json({
   success:true,
   message:"User registered successfully"
});

}catch(err){
console.log("An error occured :",err);

return res.status(500).json({
    success:false,
    message:"Internal Server Error"
});

}

}
const login=async (req,res)=>{
  try{
  const {email,password}=req.body;

    const user=await User.findOne({email});
    if(!user){
       return res.status(404).json({
            status:false,
            message:"User not found"
        });
    }

    const isMatch=await bcrypt.compare(
    password,
    user.password
);
if(!isMatch){
   return res.status(401).json({
    status:false,
    message:"Invalid Credentials"
   })
}
const token=jwt.sign(
    {
        email:user.email,
        id:user._id
    },
    JWT_SECRET,
    {
        expiresIn:"7d"
    }
);

res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    maxAge:7*24*60*60*1000
});
return res.status(200).json({
    success:true,
    message:"Login successful"
});
  }catch(err){
 return res.status(404).json({
         success:false,
         message:"Internal Server Error"
      });
  }

};
const logout=async(req,res)=>{
      res.clearCookie("token");
   
      return res.status(200).json({
         success:true,
         message:"Logout Successfully"
      });
   
}
module.exports={signup,login,logout};