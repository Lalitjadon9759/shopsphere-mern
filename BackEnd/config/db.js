const mongoose=require("mongoose")

const URL=process.env.DATABASE_URL
console.log(URL)
const connectToDb=async()=>{
    try {
        await mongoose.connect(URL)
        console.log("database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports=connectToDb;

