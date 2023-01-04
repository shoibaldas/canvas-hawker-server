const HTTP_STATUS = require("../utils/httpStatus");
const { success, failure } = require("../utils/commonResponse");
const { validationResult } = require("express-validator");
const { promisify } = require("util");
const Post = require("../models/post");
const fs = require("fs/promises");
const path = require("path");

//Create a new Post
class postController {
    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!req.file) {
                errors.errors.push({
                  param: "courseImage",
                  msg: "Course Image is required. Only jpeg, jpg and png file is allowed!",
                });
              }
              if (!errors.isEmpty()) {
                if (req.file) {
                  await fs.unlink(
                    path.join(__dirname, "..", "images", req.file.filename)
                  );
                }
                return res
                  .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                  .send(failure("Invalid Inputs", errors.array()));
              }
            const desc = req.body.desc;
            const price = req.body.price;
            const photoUrl = "images/" + req.file.filename; ;

            const post = new Post({
                desc,
                price,
                photoUrl
            });
            await post.save();
            return res
                .status(HTTP_STATUS.OK)
                .send(success("Post has been published successfully", []));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // get post
    async getPost(req, res, next) {
        try {
            const allPost = await Post.find()
                .populate("_id", "name -_id")
                .exec();
            return res
                .status(HTTP_STATUS.OK)
                .send(success("All post has been fetched successfully", allPost));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}


module.exports = new postController();