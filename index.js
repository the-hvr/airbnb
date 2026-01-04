const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Load .env variables
require('dotenv').config(); 

const app = express();
const PORT =process.env.PORT || 8080;


//EJS SETUP :
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);


//MIDDLEWARES : 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended : true}));
app.use(express.json());


// override with POST having ?_method=DELETE/PUT/PATCH
app.use(methodOverride('_method'));


//MONGOOSE SETUP FOR LOCAL DB:
// const mongoose_url = 'mongodb://127.0.0.1:27017/wanderlust';

// main()
//     .then(() => console.log(`CONNECTION SUCCESSFULL AT URL ${mongoose_url}`))
//     .catch((err) => console.log(err));

// async function main() {
//     await mongoose.connect(mongoose_url);
// }


//MONGOOSE SETUP FOR ATLAS :
const mongoose_url = process.env.MONGO_URI;  // Use URI from .env

main()
    .then(() => console.log(`MongoDB connected!`))
    .catch((err) => console.log("MongoDB connection error:", err));

async function main() {
    await mongoose.connect(mongoose_url, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
}


//REQUIRED LISITING MODEL : 
const Listing = require('./models/listing.js');


// ROOT ROUTE
app.get('/', (req, res) => {
    res.redirect('/listings')
});


//GET ALL LISITING ROUTE
app.get('/listings', async (req, res) => {
    try{
        const allListings = await Listing.find();
        res.render('./listings/index.ejs', {allListings});
    } 
    catch (error){ 
        console.log(err);
        res.status(500).send("SERVER SIDE ERROR!");
    }     
});


//GET & CREATE NEW ROUTE
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    try {
        await newListing.save();
        res.redirect('/listings');
      }
    catch(err) {
        console.log(err);
        res.status(500).send("SERVER SIDE ERROR!");
    }
});


//SHOW ROUTE
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
});


//GET & UPDATE ROUTE
app.get('/listings/:id/edit', async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', {listing});
});

app.put('/listings/:id', async (req, res) => {
    const {id} = req.params;

    try{
        await Listing.findByIdAndUpdate(id, {...req.body.listing} , {runValidators: true});
        res.redirect(`/listings/${id}`);
    }
    catch (err){
        console.log(err);
        res.status(500).send("SERVER SIDE ERROR!");
    }
});


//DELETE ROUTE
app.delete('/listings/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await Listing.findByIdAndDelete(id);
        res.redirect('/listings');
    }
    catch(err) {
        console.log(err);
        res.status(500).send("SERVER SIDE ERROR!");
    }
})


// 404 - Not Found (MIDDLEWARE)
app.use((req, res) => {
  res.status(404).send(`
    <h1 style="text-align:center; margin-top:20vh; font-family: Arial;">
      404 — Page Not Found<br>
      <small>This project is currently under construction.</small>
    </h1>
  `);
});


//RUNNING PORT
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON localhost:${PORT}`);
});
