require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

app.use(express.json())
app.use(cors())

const mongodbUrl = process.env.MONGODB_URL
const port = 4000
 const connectDB = async () => {
    try {
        const con = await mongoose.connect(mongodbUrl)
        console.log("database connected successfully")
        app.listen(port,()=>{
             console.log(`🚀 Server is running on port ${port}`);
        })
    } catch (error) {
         console.error("❌ MongoDB connection failed:", error.message);
    }
}