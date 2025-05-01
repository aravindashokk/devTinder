const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//Get profile data
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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
 
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request!");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();      

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully!`,
            data: loggedInUser,
        });
    } catch(err) {
        res.status(400).send("Something went wrong: " + err.message);
    }
});

module.exports = profileRouter;