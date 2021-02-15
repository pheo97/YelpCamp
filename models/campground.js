const mongoose = require('mongoose');
const Schema = mongoose.Schema

//new schema has been created 
const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String
})

//export the database 
module.exports = mongoose.model('Campground',CampgroundSchema)