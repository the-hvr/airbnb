const mongoose = require('mongoose');

//LISIING SCHEMA :
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    }, 
    image : {
        filename : {
            type : String,
            default: "listingimage",
        },
        url : {
            type : String,
        default : 'https://images.unsplash.com/photo-1762338693540-9011e09846de?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        set : 
        (v) => v === "" 
        ? "https://images.unsplash.com/photo-1762338693540-9011e09846de?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        : v,
        },
    }, 
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    }
});


//LISTING MODEL :
const Listing = mongoose.model('Listing', listingSchema);


//EXPORT LISITNG MODEL :
module.exports = Listing;
