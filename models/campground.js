const mongoose = require('mongoose');
const reviews = require('./review');
const Schema = mongoose.Schema

//new schema has been created 
const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
           type:Schema.Types.ObjectId,ref:'Review'
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