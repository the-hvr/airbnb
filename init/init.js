const initData = require('./data.js');
const Listing = require('../models/listing.js');
const mongoose = require('mongoose');
const mongoose_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => console.log('CONNECTION SUCCESSFULLY'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoose_url);
}

const initdb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data initialized successfully");
}

initdb();