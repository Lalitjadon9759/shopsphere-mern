const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
   name:{type:String,required:true},
   email:{type:String,unique:true,required:true},
   password:{type:String,default:"pass123"},
   age:{type:Number,min:20,max:100},
   gender:{type:String,enum:["male","female"]},
})
const UserModel=mongoose.model("User",UserSchema)
module.exports=UserModel;