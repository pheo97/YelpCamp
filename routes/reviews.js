const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../Utilities/catchAsync');

const review = require('../controllers/review');
const {validateReview, isloggedIn,isReviewAuthorised}= require('../middleware');




router.post('/',isloggedIn,validateReview, catchAsync(review.createReview))

router.delete('/:reviewId',isloggedIn,isReviewAuthorised,catchAsync(review.deleteReview))

module.exports = router;