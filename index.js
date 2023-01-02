const express = require("express");
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const cors = require("cors");
const port = process.env.PORT || 5000;

const authRouter = require("./routes/route");
const { failure } = require("./utils/commonResponse");
const HTTP_STATUS = require("./utils/httpStatus");

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(authRouter);

app.use((req, res, next) => {
    res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure(`Can't ${req.method} ${req.url}`));
});

app.use((err, req, res, next) => {
    console.log(err);
    res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal Server Error!", err.message));
});

databaseConnection(() => {
    app.listen(port, () => {
        console.log(`ATG World Portal is running on PORT: ${port}`);
    });
});