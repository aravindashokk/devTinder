const express = require("express");

const app = express();

const {adminAuth} = require("./middlewares/auth");

app.use("/admin",adminAuth);

app.get("/user",(req,res)=>{
    res.send("User Data Sent");
});

app.get("/admin/getAllData", (req,res)=>{
    res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req,res)=>{
    res.send("Deleted a User");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000")
});