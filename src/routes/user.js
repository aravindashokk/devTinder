const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest')
const userRouter = express.Router();

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUserId._id,
            status : "interested",
        }).populate("fromUserId", ["firstName", "lastName","age","gender","about","skills"]);
        
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

module.exports = userRouter;