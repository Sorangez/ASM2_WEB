import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"

const app = express();
const port = 3000;

app.use(express.static("public"));
// Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));



// Server Requests
app.get("/", (req, res) => {
    res.render("Signup.ejs");
})

app.get("/login", (req, res) => {
    res.render("Login.ejs");
})

app.get("/signup", (req, res) => {
    res.render("Signup.ejs");
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})