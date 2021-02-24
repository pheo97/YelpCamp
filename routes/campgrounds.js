const express = require('express')
const router = express.Router({mergeParams:true});

const catchAsync = require('../Utilities/catchAsync');
const ExpressError = require('../Utilities/ExpressError');



const Campground = require('../models/campground');
const { campgroundSchema ,reviewSchema} = require('../schemas.js');

const joi = require('joi');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//route to view all campgrounds
router.get('/', async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })
});

//add new campground
router.get('/new', (req,res) =>{
    res.render('campgrounds/new')
 });

 //save new campground to database 
 router.post('/', catchAsync(async(req,res,next)=>{
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
router.get('/:id',catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/details',{campground})
}));

//Edit campground
router.get('/:id/edit' ,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}));

//update to the editted version of the campground
router.put('/:id', validateCampground,catchAsync( async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground
router.delete('/:id',catchAsync(async(req,res) =>{
    const { id } =req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');

}));



module.exports = router;