const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");

const InitiateMongoServer = async () => {
  const conn = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.america.bold);
};

module.exports = InitiateMongoServer;
