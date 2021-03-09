const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()* 250) + 10;

        const camp = new Campground({
            author: '603e394d3c504a1eec9e9844',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus harum dignissimos quos itaque necessitatibus officia et voluptatum neque, sequi optio nobis, quibusdam ad placeat deleniti sapiente minima iusto soluta veritatis?',
            price,
            geometry: { 
                type: 'Point',
                coordinates: [ -26.029072, 28.033694  ]
             },
            images:[
                {
                        url: 'https://res.cloudinary.com/ddvvtpekz/image/upload/v1614952937/YelpCamp/voor7j0bzzvxnm4a9yoc.jpg',
                        filename: 'YelpCamp/voor7j0bzzvxnm4a9yoc'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})