
const AuthUser=require("../models/auth.model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const register = async (req, res) => {
    try {



        const { name, email, password } = req.body;

        const existingUser = await AuthUser.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                mess: "Email already exists"
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = new AuthUser({
            name,
            email,
            password: hashedpassword
        });

        await user.save();

        res.status(201).json({
            mess: "User registered"
        });

    } catch (error) {
        res.status(500).json({
            mess: error.message
        });
    }
};
const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await AuthUser.findOne({email})
        if(!user){
            return res.status(401).json({mess:"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({mess:"password inncorrect"})
        }
        const token=jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        )
        res.json({
            token:token
        })
      
    } catch (error) {
        res.status(500).json({mess:error.message})
    }
}
module.exports = {
    register,
    login
};