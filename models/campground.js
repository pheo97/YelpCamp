const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema

//new schema has been created 
const CampgroundSchema = new Schema({
    title:String,
    images:[
        {
           url:String,
           filename:String
    }],
    price:Number,
    description:String,
    location:String,
    author:[
        {
           type:Schema.Types.ObjectId,
           ref:'User'
        }
    ],
    reviews:[
        {
           type:Schema.Types.ObjectId,
           ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//export the database 
module.exports = mongoose.model('Campground',CampgroundSchema)