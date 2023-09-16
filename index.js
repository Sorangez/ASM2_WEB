const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.static("public"));
// Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to MongoDb
mongoose.connect("mongodb+srv://admin:youcanthackme@sheep.sdlncg9.mongodb.net/")
.then(() => console.log("Connected to MongoDB Compaass!"))
.catch ((error) => console.log(error.message));

// Creating user schema

const customer_schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true }
});

const vendors_schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: { type: String, required: true, unique: true},
    customer_email: { type: String, unique: true, required: true},
    password: { type: String, required: true }
});

// Creating Customers Models
const Customers = mongoose.model('Customers', customer_schema);


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


// Post requests

app.post("/submit", (req, res) => {
    const customer = new Customers(req.body);
    if (req.body["password"] === req.body["re-password"]) {
        console.log(req.body);
        customer.save()
            .then((customer) => console.log(`${customer} has been added to MongoDB`))
            .catch((error) => console.log(`Fuck you this is the error. ${error}`));
    } else {
        res.render("Signup.ejs")
    }
});


// Port initialization 

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})