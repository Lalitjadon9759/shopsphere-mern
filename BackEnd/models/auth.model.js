const mongoose=require("mongoose");

const authSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,default:"123456"},
        role:{
        type:String
    
    }
})

const authModel=mongoose.model("AuthUser",authSchema);
module.exports=authModel;