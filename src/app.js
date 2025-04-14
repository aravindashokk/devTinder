const express = require("express");

const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName: "Aravind", lastName: "Ashok"});
});

app.post("/user",(req,res)=>{
    res.send("Data saved successfully to the database");
});

app.delete("/user",(req,res)=> {
    res.send("Deleted successfully");
})

//match all the HTTP method API calls to /test
app.use("/test",(req, res) => {
    res.send("Hello from the server");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000")
});