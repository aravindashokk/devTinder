const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

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

//Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }

    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message)
    }

});

//Get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length == 0) {
            res.status(404).send("User not found");
        }
        res.send(users);

    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
});

//Delete a user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
    }
})

//Update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

        const isUpdateAlloweed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAlloweed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        res.send("Updated successfully")
    } catch (err) {
        res.status(400).send("Update failed:" + err.message);
    }

})

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777..")
    });
}).catch(err => {
    console.error("Database cannot be connected!!");
});

