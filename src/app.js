const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    // const userObj = {
    //     firstName: "Dhoni",
    //     lastName: "MS",
    //     emailId: "dhoni@gmail.com",
    //     password: "dhoni@123",
    // }

    //Creating a new instance of the User Model
    const user = new User(req.body)

    try {
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
        const user = await User.findOne({emailId: userEmail});
        if (!user) {
            res.status(404).send("User not found");
        }
        else{
        res.send(user);
        }

        // const users = await User.find({ emailId: userEmail });
        // if (users.length == 0) {
        //     res.status(404).send("User not found");
        // }
        // res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message)
    }

});

//Get all users
app.get("/feed", async (req, res) => {
    try { 
        const users = await User.find({ });
        if (users.length == 0) {
            res.status(404).send("User not found");
        }
        res.send(users);

    } catch (err) {
        res.status(400).send("Something went wrong:" + err.message);
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

