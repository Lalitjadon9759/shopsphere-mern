const express=require("express")
const app=express()
const userRouter =require("./routes/userRoutes")
const router=require("./routes/orderRoutes")
const authrouter=require("./routes/authRoutes")
app.use(express.json());

require("dotenv").config()


const connectToDb =require("./config/db")
connectToDb()

app.use("/",authrouter)
app.use("/users",userRouter);
app.use("/order",router);
const port=process.env.PORT || 3000
app.listen(port,()=>{
   console.log(`server is running on port ${port}`)
}) 