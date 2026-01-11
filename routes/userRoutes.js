const express = require("express");
const {signUp,logIn, getProfile, createBlog, getBlogs, getBlogByuserId,updateBlog, deleteBlog,getBlogsByCategory} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadImageMiddleware");
const router = express.Router();

router.post("/signup",signUp)
router.post("/login",logIn)
router.get("/profile",authMiddleware,getProfile)
router.post("/createblog",upload.single("photo"),authMiddleware,createBlog)
router.get("/blogs",getBlogs)
router.get("/blogbyuser",authMiddleware,getBlogByuserId)
router.put("/updateblog/:id",upload.single("photo"),authMiddleware,updateBlog)
router.delete("/deleteblog/:id",authMiddleware,deleteBlog)
router.get("/category/:category",getBlogsByCategory)

module.exports = router