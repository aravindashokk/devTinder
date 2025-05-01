const express = require('express');
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        console.log("Send a connection request");

        res.send(user.firstName + " sent the connecton request");

    } catch (err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

module.exports = requestRouter;