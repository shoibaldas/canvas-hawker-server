const HTTP_STATUS = require("../utils/httpStatus");
const { success, failure } = require("../utils/commonResponse");
const { validationResult } = require("express-validator");
const { promisify } = require("util");
const Post = require("../models/post");

//Create a new Post
class postController {
    async createPost(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Invalid inputs", errors.array()));
            }
            if (!req.file) {
                return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ message: 'Please add an image!' });
            }
            const desc = req.body.desc;
            const price = req.body.price;
            const photoUrl = req.file.path.replace("\\", "/");

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