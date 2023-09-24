const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.static("public"));
// Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));


// Configure EJS as the view engine
app.set('view engine', 'ejs');

// Connecting to MongoDb
mongoose.connect("mongodb+srv://admin:youcanthackme@sheep.sdlncg9.mongodb.net/")
.then(() => console.log("Connected to MongoDB Compass!"))
.catch ((error) => console.log(error.message));


// Customer Schema
const customer_schema = new mongoose.Schema({
    role: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    city: { type:String, required: true },
    payment: { type:String, required: true },
});

const vendor_schema = new mongoose.Schema({
    role: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    business: { type: String, required: true, unique: true }, 
    vendor_address: { type: String, required: true },
    vendor_city: { type:String, required: true },
});

const shipper_schema = new mongoose.Schema({
    role: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    ship_city: { type:String, required: true },
});

// Creating Customers Models
const Customers = mongoose.model('Customers', customer_schema);
const Vendors = mongoose.model('Vendors', vendor_schema);
const Shippers = mongoose.model('Shippers', shipper_schema);

// Server Requests
app.get("/", (req, res) => {
    res.render("customer.ejs");
})

app.get("/login", (req, res) => {
    res.render("Login.ejs");
})

app.get("/signup", (req, res) => {
    res.render("Signup.ejs");
})


// Server Post Signup
app.post("/submit", (req, res) => {
    if (req.body["role"] === "customer") {
        const customer = new Customers(req.body);
        customer.save()
            .then((customer) => console.log(`${customer} has been added to MongoDB`))
            .catch((error) => console.log(error));

    } else if (req.body["role"] === "vendor") {

        const vendor = new Vendors(req.body);
        vendor.save()
            .then((vendor) => console.log(`${vendor} has been added to MongoDB`))
            .catch((error) => console.log(error));

    } else {
        const shipper = new Shippers(req.body);
        shipper.save()
            .then((shipper) => console.log(`${shipper} has been added to MongoDB`))
            .catch((error) => console.log(error));
    }

    res.redirect("Login")
});


// Server Post Login
app.post("/login", (req, res) => {
    if (req.body["email"] === Customers.find({ email: req.body["email"]}) && req.body["password"] === Customers.find({ password:req.body["password"] })) {
        res.render("Home.ejs")
    } else {
        res.render("Login.ejs")
    }
}); 
// Listen Port
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})