const express = require('express')
const router = express.Router({mergeParams:true});

const catchAsync = require('../Utilities/catchAsync');

const {isloggedIn,isauthorised, validateCampground} = require('../middleware');



const Campground = require('../models/campground');





//route to view all campgrounds
router.get('/', async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })
});

//add new campground
router.get('/new',isloggedIn, (req,res) =>{
    res.render('campgrounds/new')
 });

 //save new campground to database 
 router.post('/',isloggedIn, validateCampground,catchAsync(async(req,res,next)=>{
      const campground = new Campground(req.body.campground);
      campground.author = req.user._id;
      await campground.save();
      req.flash( 'success', 'Succesfully made a new campground')
      res.redirect(`/campgrounds/${campground._id}`);
 }))

//view campground details 
router.get('/:id',catchAsync(async (req,res) =>{
    const campground = await Campground.findById(req.params.id).
    populate({path:'reviews',populate:{path:'author'}}).populate('author');
    if(!campground)
    {
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds');
    }
   
    res.render('campgrounds/details',{campground});
}));

//Edit campground
router.get('/:id/edit' ,isloggedIn,isauthorised,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}));

//update to the editted version of the campground
router.put('/:id', isloggedIn, isauthorised,validateCampground,catchAsync( async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully Updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete campground
router.delete('/:id',isloggedIn,catchAsync(async(req,res) =>{
    const { id } =req.params
    console.log(id);
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}));



module.exports = router;