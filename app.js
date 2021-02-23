//load up all plug ins to be used 
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { campgroundSchema ,reviewSchema} = require('./schemas.js');
const mongoose = require('mongoose');
const catchAsync = require('./Utilities/catchAsync');
const ExpressError = require('./Utilities/ExpressError');
const joi = require('joi');
const Review = require('./models/review');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false})
.then(() => {
    console.log("DATABASE CONNECTED")
})
.catch(err => {
    console.log("DATABASE NOT CONNECTED")
    console.log(err)
})
//embed ejs to be used 
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

//middleware
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}




//default route
app.get('/', (req,res) =>{
   res.render('home')
});

//route to view all campgrounds
app.get('/campgrounds', async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })
});

//add new campground
app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
 });

 //save new campground to database 
 app.post('/campgrounds', catchAsync(async(req,res,next)=>{
      const campground = new Campground(req.body.campground);

      const campgroundSchema = joi.object({
          campground:joi.object({
             title: joi.string().required(),
             price: joi.number().required().min(0)
          }).required()
      })
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
 }))

//view campground details 
app.get('/campgrounds/:id',catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/details',{campground})
}));

//Edit campground
app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}));

//update to the editted version of the campground
app.put('/campgrounds/:id', catchAsync( async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.render('campgrounds/edit',{campground});
}));

//delete campground
app.delete('/campgrounds/:id',catchAsync(async(req,res) =>{
    const { id } =req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');

}));

app.post('/campgrounds/:id/reviews',validateReview,  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const{statusCode = 500,message = 'Something Went wrong!'} = err;
    if(!err.message) err.message = 'Oh No Something Went Wrong'
    res.status(statusCode).render('error' , { err}) 
})



//checking connection
app.listen(3000,()=>
{
    console.log("APP LISTENING ON 3000");
});