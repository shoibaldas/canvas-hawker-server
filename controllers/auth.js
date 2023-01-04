const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const HTTP_STATUS = require("../utils/httpStatus");
const { success, failure } = require("../utils/commonResponse");
const { validationResult } = require("express-validator");
const { promisify } = require("util");

class authController {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Invalid inputs", errors.array()));
            }
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            const password = await bcrypt.hash(req.body.password, 10);
            const role = 'User';
            const user = new User({
                firstName,
                lastName,
                email,
                password,
                role
            });
            await user.save();

            const userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            };

            const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
                expiresIn: "10h",
            });

            const resData = {
                access_token: jwtToken,
                ...userData,
            };

            return res
                .status(HTTP_STATUS.OK)
                .send(success("Signup success!", resData));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async signin(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Invalid input", errors.array()));
            }
            const user = await User.findOne({ email: req.body.email }).exec();
            if (!user) {
                return res
                    .status(HTTP_STATUS.UNAUTHORIZED)
                    .send(failure("Unauthorized user login!"));
            }

            const passMatch = await bcrypt.compare(req.body.password, user.password);

            if (!passMatch) {
                return res
                    .status(HTTP_STATUS.UNAUTHORIZED)
                    .send(failure("Unauthorized user login"));
            }

            const userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            };

            const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
                expiresIn: "10h",
            });
            const resData = {
                access_token: jwtToken,
                ...userData,
            };

            return res
                .status(HTTP_STATUS.OK)
                .send(success("Sign in Successfully", resData));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
                    .send(failure("Invalid Inputs", errors.array()));
            }
            const password = req.body.password;
            const user = await User.findOne({ email: req.body.email }).exec();
            if (!user) {
                return res
                    .status(HTTP_STATUS.UNAUTHORIZED)
                    .send(failure("Unauthorized user login"));
            }

            user.password = await bcrypt.hash(password, 10);
            await user.save();

            return res
                .status(HTTP_STATUS.OK)
                .send(success("Password change is successful!"));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

module.exports = new authController();