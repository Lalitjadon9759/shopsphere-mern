const express=require("express");
const userRouter=express.Router();
const {getUser,getUserById,createUser,updateUser,deleteUser}=require("../controllers/userController")
const auth =require("../middleware/authentication")
const rolecheck=require("../middleware/authorization")

userRouter.get('/',auth,getUser)
userRouter.get("/:id",auth,getUserById);
userRouter.post('/',auth,createUser);
userRouter.patch('/:id',auth,rolecheck,updateUser);
userRouter.delete("/:id",auth,rolecheck,deleteUser);

module.exports=userRouter;
