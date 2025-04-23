const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
            res.send("Login successfull!");
        }
        else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message)
    }
});

//Get profile data
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error("User does not exist");
        }

        res.send(user);

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log("Send a connection request");

        res.send(user.firstName + " sent the connecton request");

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});



connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777..")
    });
}).catch(err => {
    console.error("Database cannot be connected!!");
});

