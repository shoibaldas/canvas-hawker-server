const mongoose = require("mongoose");

const databaseConnection = async (callback) => {
    try {
        const client = await mongoose.connect(process.env.DATABASE_URI);
        // const client = await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });
        if (client) console.log("Database connection is successful!!");
        callback();
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = databaseConnection;