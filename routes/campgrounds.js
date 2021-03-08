const express = require('express')
const router = express.Router({mergeParams:true});
const campground = require('../controllers/campground')
const catchAsync = require('../Utilities/catchAsync');

const {isloggedIn,isauthorised, validateCampground} = require('../middleware');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage})


const Campground = require('../models/campground');





//route to view all campgrounds
router.get('/', catchAsync(campground.index)
);



//view new campground page
router.get('/new',isloggedIn, campground.viewNewForm
 );

 //save new campground to database 
 router.post('/',isloggedIn, upload.array('image'),validateCampground,catchAsync(campground.createCampground))

 /*router.post('/',upload.array('image'),(req,res)=>{
    console.log(req.body,req.files)
    res.send("Uploaded")
})*/

//view campground details page
router.get('/:id',catchAsync(campground.viewCampground));

//view Edit campground page
router.get('/:id/edit' ,isloggedIn,isauthorised,catchAsync(campground.viewEditForm));

//update campground 
router.put('/:id', isloggedIn, isauthorised,upload.array('image'),validateCampground,catchAsync(campground.updateCampground));

//delete campground
router.delete('/:id',isloggedIn,catchAsync(campground.deleteCampground));



module.exports = router;