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


connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777..")
    });
}).catch(err => {
    console.error("Database cannot be connected!!");
});

