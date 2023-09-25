// RMIT University Vietnam
//   Course: COSC2430 Web Programming
//   Semester: 2023A
//   Assessment: Assignment 2
//   Author: Group 4
//   ID: 
//     Nguyen Thanh Tung - s3979425
//     Nguyen The Vinh - s3979366
//     Nguyen Ba Lam Quang Thai - s3975154
//     Nguyen Nghia Hiep - s3978270
//     Dang Trung Kien - s3979510
//   Acknowledgement: ChatGPT, GoogleFonts, BoxIcon, Bootstrap
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
mongoose.connect("mongodb+srv://DataBase:123456789!@cluster0.5zebwgd.mongodb.net/data_storage")
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
    cart: {
        type: [vendor_products]
    }
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
    },
    cart: {
        type: [vendor_products]
    }
});

const shipper_schema = new mongoose.Schema({
    role: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    ship_city: { type:String, required: true },
    cart: {
        type: [vendor_products]
    }
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
    constructor(image_url, name, material, season, price, stock, product_description) {
        this.image_url = image_url;
        this.name = name;
        this.material = material,
        this.season = season,
        this.price = price,
        this.stock = stock,
        this.product_description = product_description
    }
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

// Server Requests
app.get("/", (req, res) => {
    Products.find({}).then(products => {
        res.render("index.ejs", {productList: products});
    })
})

app.post("/search", async (req, res) => {
    try {
        console.log(req.body.search);

        // Construct a compound query using $or
        const search_query = {
            $or: [
                { 'name': { $regex: req.body.search, $options: 'i' } },       // Search in 'name'
                { 'material': { $regex: req.body.search, $options: 'i' } },   // Search in 'material'
                { 'season': { $regex: req.body.search, $options: 'i' } }      // Search in 'season'
            ]
        };

        // Use the compound query to search across multiple fields
        const products = await Products.find(search_query);

        res.render("index", { productList: products });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/login", (req, res) => {
    res.render("Login.ejs");
})

app.get("/signup", (req, res) => {
    res.render("Signup.ejs");
})

app.get("/vendor", (req, res) => {
    res.render("vendor.ejs");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.get("/terms", (req, res) => {
    res.render("terms.ejs");
})

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

// app.get("/view-details/:id", (req, res) => {
//     const productId = req.params.id; // Use req.params.id to get the ID from the URL
//     console.log(`Accessed /view-details/${productId}`);

//     // Rest of your route handler code
// });

app.get("/view-details/:id", (req, res) => {
    const productId = req.params.id; // Use req.params.id to get the ID from the URL
    req.session.product_id = productId;
    Products.findById(productId)
        .then((product) => {
            console.log(product);
            if (!product) {
                // Handle the case where the product with the provided ID doesn't exist
                res.status(404).send("Product not found");
            } else {
                // Render the view-details page with the product data
                res.render('view-details', { product: product });
            }
        })
        .catch((error) => {
            // Handle any errors that may occur during the database query
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});


app.get("/cart", (req, res) => {

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
                const user_id = vendor.id
                const products = vendor.products;
                req.session.user_id = user_id;
                req.session.user_role = vendor.role;
                res.render('vendor', {vendor: vendor, products: products});
            })
        } else {
            res.redirect('shipper')
        }
    } else {
        console.log("Account not found")
    }
});


// Vendor add products
app.post("/vendor", upload.single('image_url'), (req, res) => {
    console.log(req.body);
    const user_id = req.session.user_id; // Assuming you have stored the vendorId in the session
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

    // Save the product to the Products collection
    product.save()
        .catch((error) => {
            productList.push(new Product(image_url, name, material, season, price, stock, product_description));
            // Handle any errors that may occur during saving the product
            console.error(error);
            res.status(500).send("Internal Server Error");
        });


    // Find the vendor by vendorId
    Vendors.findById(user_id)
        .then((vendor) => {
            if (!vendor) {
                // Handle the case where the vendor with the provided ID doesn't exist
                res.status(404).send("Vendor not found");
            } else {
                // Add the product to the vendor's products array
                vendor.products.push(product);
                
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

app.post('/cart', (req, res) => {
    console.log(req.body);
    const user_role = req.session.user_role;
    const user_id = req.session.user_id;
    const product_id = req.session.product_id;
    const size = req.body.flexRadioDefault;
    const parsedSize = parseInt(size, 10); // Parse size to an integer
    const price = req.body.price;
    const totalPrice = price * parsedSize; // Use parsedSize for calculations

    Products.findById(product_id).then(product => {
        res.render("cart.ejs", { product: product, size: parsedSize, totalPrice: totalPrice });
    })
    


})


// Listen Port
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})