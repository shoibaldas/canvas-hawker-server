const express = require("express");
const authController = require("../controllers/auth");
const validator = require("../middlewares/validation");
const postController = require("../controllers/postContent");
const uploadImage = require('../middlewares/upload-image');
const { checkAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

//signup
router.post("/api/v1/signup", validator.signup, authController.signup);
//signIn
router.post("/api/v1/signin", validator.signin, authController.signin);

//creating post
router.post("/api/v1/addPost", checkAuth, isAdmin, uploadImage, postController.createPost);

module.exports = router; 