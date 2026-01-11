const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async() =>{
    try {
        const conn = mongoose.connect(process.env.MONGO_DB_URI)
        console.log("mongoDB connected!")
    } catch (error) {
         console.error("MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
    }
}

module.exports = connectDB