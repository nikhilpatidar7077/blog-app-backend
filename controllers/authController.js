const Auth = require("../models/Auth");
const Blog = require("../models/Blog");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

dotenv.config();

const signUp = async (req, res) => {
  try {
    const { fullname, email, address, mobile, password } = req.body;

    if (!fullname || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailExists = await Auth.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const mobileExists = await Auth.findOne({ mobile });
    if (mobileExists) {
      return res
        .status(400)
        .json({ error: "Mobile number already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new Auth({
      fullname,
      email,
      address,
      mobile,
      password: hashedPassword,
    });
    await createUser.save();
    res.status(201).json({
      success: true,
      message: "user created Successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // res.json({ token });
    res.status(200).json({
      success: true,
      message: "user login successfully!",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if(!req.user.id){
      res.status(404).json({
        message: "Id not found"
      })
    }
    const profileDetails = await Auth.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: profileDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { authername, title, description, category } = req.body;
    let photoBase64 = null;
    if (req.file) {
      photoBase64 = req.file.buffer.toString("base64"); // Convert file to base64
    }
    const createblog = new Blog({
      authername,
      title,
      description,
      category,
      autherID: req.user.id,
      photo: photoBase64,
    });
    await createblog.save();
    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().sort({ createdAt: -1 });;
    if(!allBlogs || allBlogs.length ===0){
      res.json({
        message:"there is no blogs"
      })
    }
    res.status(200).json({
      success: true,
      data: allBlogs,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getBlogByuserId = async (req, res) => {
  try {
    const id = req.user.id;
    if(!id){
      res.status(404).json({
        message:"Id not found!"
      })
    }
    const blogbyid = await Blog.find({ autherID:id });
    if(!blogbyid || blogbyid.length === 0){
      res.json({
        message:"there is no blogs"
      })
    }
    res.status(200).json({
      success: true,
      data: blogbyid,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateBlog = async (req,res) => {
  try {
    const blogid = req.params.id
    const {authername,title,description,category} = req.body
     if(!blogid){
     res.status(404).json({
      message:"Id not found!"
     })
    }
    const updateData = {authername,title,description,category}
    if (req.file) {
      updateData.photo = req.file.buffer.toString("base64");
    }
    const blog = await Blog.findByIdAndUpdate(blogid,updateData,{new:true})
    res.status(200).json({
      success:true,
      message:"blog updated successfully!"
    })
  } catch (error) {
    res.status(200).json({
      error: error.message
    })
  }
}

const deleteBlog = async (req,res) => {
try {
  const blogid = req.params.id
   if(!blogid){
     res.status(404).json({
      message:"Id not found!"
     })
    }
  await Blog.findByIdAndDelete(blogid)
  res.status(200).json({
    success:true,
    message:"blog deleted successfully!"
  })
} catch (error) {
  res.status(500).json({
    error:error.message
  })
}
}

const getBlogsByCategory = async (req,res) =>{
  try {
    const category = req.params.category
    const find = await Blog.find({category:category})
    if(!find || find.length === 0){
      res.json({
        message: "In this category blogs not created yet!"
      })
    }
    res.status(200).json({
      success:true,
      data:find
    })
  } catch (error) {
    res.status(500).json({
      error:error.message
    })
  }
}

module.exports = {
  signUp,
  logIn,
  getProfile,
  createBlog,
  getBlogs,
  getBlogByuserId,
  updateBlog,
  deleteBlog,
  getBlogsByCategory
};
