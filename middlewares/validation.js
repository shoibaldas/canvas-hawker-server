const { body } = require("express-validator");
const User = require("../models/user");

const validator = {
    signup: [
        body("username", "Username is required and must be String")
            .trim()
            .notEmpty()
            .isString(),
        body("email", "Email is invalid").custom(async (value) => {
            const user = await User.findOne({ email: value }).exec();
            if (user) {
                return Promise.reject("Email is already exists!");
            }
            return true;
        }),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password does not matched");
                }
                return true;
            }),
    ],

    signin: [
        body("password").trim().notEmpty().withMessage("Password is required"),
    ]

};

module.exports = validator;