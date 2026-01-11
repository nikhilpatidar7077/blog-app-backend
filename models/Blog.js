const { Schema, model, default: mongoose } = require("mongoose");

const blogSchema = new Schema({
  authername: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Photography",
      "Travel",
      "Lifestyle",
      "Education",
      "Technology",
      "Cooking"
    ],
  },
  autherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogModel = model("blog", blogSchema);

module.exports = blogModel;
