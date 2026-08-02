

const rolecheck=(role)=>{
   return (req,res,next)=>{
    if(req.user.role!==role){
        return res.status(403).json({mess:"access denied"});
    }
    next()
   }
}

module.exports=rolecheck;
