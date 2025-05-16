const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { validateSignUpData } = require("../utils/validation");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        //Validation of data
        validateSignUpData(req);

        //Encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating a new instance of the User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        await user.save();
        res.send("User Added successfully");
    } catch (err) {
        res.status(400).send("Error saving the  user:" + err.message);
    }

});

//Login API
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send(user);
        }
        else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message)
    }
});

//Logout API
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfull!");
});

module.exports = authRouter;