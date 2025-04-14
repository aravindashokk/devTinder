const url = "mongodb+srv://aravindkayal1:grimmjow@myfreecluster.qd3wkh8.mongodb.net/devTinder ";

const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(url);
};

module.exports = connectDB;
