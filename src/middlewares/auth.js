const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        //Read the token from the req cookies
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Token is not valid");
        }

        //verify token
        const decodedObj = await jwt.verify(token, "DEV@Tinder$98");

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

};

module.exports = {
    userAuth,
};