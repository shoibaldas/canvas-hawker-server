const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
    },
    price: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
