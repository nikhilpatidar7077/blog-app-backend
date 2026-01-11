const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/userRoutes")
const app = express();

dotenv.config();
connectDB()
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api",authRouter)
app.get("/",(req,res)=>{
    res.send("Blog App Running!")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server Runs On Port- ${process.env.PORT}`)
})