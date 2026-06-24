const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
    try{

        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized Access"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    }catch(err){

        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        });

    }
}

module.exports = auth;