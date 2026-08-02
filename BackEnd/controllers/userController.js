const User=require("../models/user.model");

const createUser=async (req,res)=>{
    try{
      const user=await User.create(req.body)
      res.status(201).json(user);
    }catch(err){
        res.status(500).json(err)
    }
}

const getUser=async (req,res)=>{
    try{
     const users=await User.find();
     res.json(users);
    }catch(err){
        res.status(500).json(err)
    }
}
const getUserById=async (req,res)=>{
    try{
     const user=await User.findById(req.params.id);
     if(!user)
     return res.status(404).json({mess:"user not found"})
     res.json(user)
    }catch(err){
        res.status(500).json(err)
    }
}
const updateUser=async (req,res)=>{
    try{
    const users=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(users) 
    }catch(err){
        res.status(500).json(err)
    }
}
const deleteUser=async (req,res)=>{
    try{
      const user = await User.findByIdAndDelete(req.params.id)
      res.json({mess:"user deleted"})
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports={getUser,getUserById,createUser,updateUser,deleteUser};