const express = require("express");
const authController = require("../controllers/auth");
const validator = require("../middleware/validation");
const postController = require("../controllers/postContent");
const commentController = require("../controllers/postComment")
const { checkAuth } = require("../middleware/authCheck");

const router = express.Router();

//signup
router.post("/api/v1/signup", validator.signup, authController.signup);
//signIn
router.post("/api/v1/signin", validator.signin, authController.signin);