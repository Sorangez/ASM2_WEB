const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var session = require('express-session')
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.static("public"));
// Using Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "i-love-bbc", 
        resave: false,
        saveUninitialized: true,
    })
);

// Configure EJS as the view engine
app.set('view engine', 'ejs');

// Define a storage strategy for multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Define the destination folder where uploaded files will be stored
        callback(null, 'public/images/upload_vendor'); // Adjust the destination as needed
    },
    filename: (req, file, callback) => {
        // Define how uploaded files should be named
        callback(null, file.originalname);
    },
});

// Create a multer instance with the defined storage strategy
const upload = multer({ storage });

// Connecting to MongoDb
mongoose.connect("mongodb+srv://vinhnt2914:vinh5504@cluster0.6axqa1q.mongodb.net/demo_data")
.then(() => console.log("Connected to MongoDB Compass!"))
.catch ((error) => console.log(error.message));

const vendor_products = new mongoose.Schema({
    image_url: { type: String },
    name: { type: String},
    material: { type: String },
    season: { type: String, enum: ['Spring', 'Summer', 'Autumn', 'Winter']},
    price: { type: Number },
    stock: { type: Number },
    product_description: { type: String }
});

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
    products : {
        type : [vendor_products]
    }
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
const Products = mongoose.model('Products', vendor_products);
// Vendor add products




// Creating account class

class Account {
    constructor(role, username, password) {
        this.role = role;
        this.username = username;
        this.password = password
    }
}

class Product {

}
// Reading MongoDB
const data = [];
Customers.find({}).then((customer) => customer.forEach(element => {
    data.push(new Account(element.role, element.username, element.password))
}));
Vendors.find({}).then((customer) => customer.forEach(element => {
    data.push(new Account(element.role, element.username, element.password))
}));
Shippers.find({}).then((customer) => customer.forEach(element => {
    data.push(new Account(element.role, element.username, element.password))
}));

const productList = [];
Vendors.find({}).then((vendors) => vendors.forEach((vendor) => {
    vendor.products.forEach(product => productList.push(product))
}));

// Server Requests
app.get("/", (req, res) => {
    res.render("index.ejs", {productList: productList});
})

app.get("/login", (req, res) => {
    res.render("Login.ejs");
})

app.get("/signup", (req, res) => {
    res.render("Signup.ejs");
})

app.get("/vendor", (req, res) => {
    res.render("vendor.ejs");
})

// app.get("/customer", (req, res) => {
//     res.render("customer.ejs")
// })

// Server Post Signup
app.post("/submit", (req, res) => {
    console.log(req.body);
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
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const ship_city = req.body.ship_city;
        const role = req.body.role;

        const shipper = new Shippers({
            role: role,
            username: username,
            email: email,
            password: password,
            ship_city: ship_city
        });
        shipper.save()
            .then((shipper) => console.log(`${shipper} has been added to MongoDB`))
            .catch((error) => console.log(error));
    }

    data.push(new Account(req.body.role, req.body.username, req.body.password));
    console.log(data)
    res.redirect("Login")
});


// Server Post Login
app.post("/login", (req, res) => {
    let accountRole;
    const usernameInput = req.body["username"];
    const passwordInput = req.body["password"];
    let accountFound = false;
    for(const account of data) {
        if (account.username == usernameInput && account.password == passwordInput) {
            accountFound = true;
            accountRole = account.role;
            break;
        }
    }

    if(accountFound) {
        
        if (accountRole == "customer") {
            console.log("CUSTOMER VERSION");
            Customers.findOne({username: usernameInput, password: passwordInput})
            .then(customer => {
                console.log(customer);
                res.render('customer', {accountName: username})
            })
            
        } else if(accountRole == "vendor") {
            console.log("VENDOR VERSION");
            Vendors.findOne({username: usernameInput, password: passwordInput})
            .then(vendor => {
                const vendor_id = vendor.id
                const products = vendor.products;
                req.session.vendor_id = vendor_id;
                res.render('vendor', {vendor: vendor, products: products});
            })
        } else {
            res.redirect('shipper')
        }
    } else {
        console.log("Mít chum")
    }
});


// Vendor add products
app.post("/vendor", upload.single('image_url'), (req, res) => {
    console.log(req.body);
    const vendor_id = req.session.vendor_id; // Assuming you have stored the vendorId in the session
    const image_url = req.file.originalname;
    const name = req.body.name;
    const material = req.body.material;
    const season = req.body.season;
    const price = req.body.price;
    const stock = req.body.stock;
    const product_description = req.body.product_description;
    // Create a new product using the request body
    const product = new Products({
        image_url: image_url,
        name: name,
        material: material,
        season: season,
        price: price,
        stock: stock,
        product_description: product_description
    });
    // Find the vendor by vendorId
    Vendors.findById(vendor_id)
        .then((vendor) => {
            if (!vendor) {
                // Handle the case where the vendor with the provided ID doesn't exist
                res.status(404).send("Vendor not found");
            } else {
                // Add the product to the vendor's products array
                vendor.products.push(product);
                productList.push(product);

                // Save the vendor with the updated products array
                vendor.save()
                    .then((savedVendor) => {
                        const products = savedVendor.products;
                        res.render('vendor', {vendor: savedVendor, products: products});
                    })
                    .catch((error) => {
                        // Handle any errors that may occur during saving
                        console.error(error);
                        res.status(500).send("Internal Server Error");
                    });
            }
        })
        .catch((error) => {
            // Handle any errors that may occur during the database query
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});


// Listen Port
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})