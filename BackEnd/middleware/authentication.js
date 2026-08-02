const jwt=require("jsonwebtoken");

const auth=async (req,res)=>{
    try {
        const token=req.header.authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded
        next();
    } catch (error) {
        res.status(500).json({mess:error.message});
    }
}

module.exports=auth;