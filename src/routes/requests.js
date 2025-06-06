const express = require('express');
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const sendEmail = require('../utils/sendEmail');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ["ignored", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status,
            });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }


        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });



        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists",
            });
        }

        const connectionRequests = new connectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequests.save();

        const emailRes = await sendEmail.run("You got a new friend request from  " + req.user.firstName, req.user.firstName + " is " + status + " in " + toUser.firstName + " from MatchTinder. Please login to your account to see the request.");

        res.json({
            message: req.user.firstName + " " + status + " " + toUser.firstName,
            data: data,
        });
    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status,
            });
        }

        const connectionRequestData = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if (!connectionRequestData) {
            return res.status(404).json({
                message: "Connection request not found",
            });
        }

        connectionRequestData.status = status;
        const data = await connectionRequestData.save();
        res.json({
            message: loggedInUser.firstName + " " + status + " the request",
            data: data,
        });
    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

module.exports = requestRouter;