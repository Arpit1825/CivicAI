const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User=require('../models/user');
const ADMIN_PRIVATE_KEY=process.env.ADMIN_PRIVATE_KEY;
const signup= async (req,res)=>{
const {name,email,password,role,adminSecretkey}=req.body;
try{
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email, and password are required"
        });
    }

    const user=await User.findOne({email})

if(user){
   return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});
}
console.log("Received Key:", adminSecretkey);
console.log("Env Key:", ADMIN_PRIVATE_KEY);
if(role==="admin"){
   if(adminSecretkey !==ADMIN_PRIVATE_KEY){
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

if (!JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is not configured. Cannot sign JWT token.");
    return res.status(500).json({
        success: false,
        message: "Internal Server Error: Authentication configuration missing"
    });
}

const token=jwt.sign({email:createuser.email,
    id:createuser._id},
    JWT_SECRET,{
        expiresIn:"7d"
    });

res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge:7*24*60*60*1000
});

return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
        _id: createuser._id,
        name: createuser.name,
        email: createuser.email,
        role: createuser.role
    }
});

}catch(err){
console.log("An error occured during signup:",err);

return res.status(500).json({
    success:false,
    message:"Internal Server Error"
});

}

}
const login=async (req,res)=>{
  try{
    const {email,password}=req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const user=await User.findOne({email});
    if(!user){
       return res.status(404).json({
            success:false,
            message:"User not found"
        });
    }

    const isMatch=await bcrypt.compare(
        password,
        user.password
    );
    if(!isMatch){
       return res.status(401).json({
        success:false,
        message:"Invalid Credentials"
       })
    }

    if (!JWT_SECRET) {
        console.error("ERROR: JWT_SECRET is not configured. Cannot sign JWT token.");
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: Authentication configuration missing"
        });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge:7*24*60*60*1000
    });
    return res.status(200).json({
        success:true,
        message:"Login successful"
    });
  }catch(err){
    console.error("Login catch error:", err);
    return res.status(500).json({
         success:false,
         message:"Internal Server Error"
      });
  }

};
const logout=async(req,res)=>{
      res.clearCookie("token", {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
   
      return res.status(200).json({
         success:true,
         message:"Logout Successfully"
      });
   
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.log("Error in getMe:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports={signup,login,logout,getMe};