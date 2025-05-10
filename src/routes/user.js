const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest')
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "about", "skills"];

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUserId._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString()===(loggedInUser._id.toString())) {
                return row.toUserId;
            }
            return row.fromUserId;
    });

        res.json({
            data,
        });

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

module.exports = userRouter;