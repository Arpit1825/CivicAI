const User = require("../models/user");

const isAdmin = async(req,res,next)=>{
    try{

        const user = await User.findById(req.user.id);

        if(user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Access Denied"
            });
        }

        next();

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }
}

module.exports = isAdmin;