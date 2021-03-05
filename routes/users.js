const express = require('express');
const catchAsync = require('../Utilities/catchAsync')
const router = express.Router();
const user = require('../controllers/user')

const passport = require('passport');

router.get('/register', user.viewRegisterform) 

router.post('/register',catchAsync(user.register));

router.get('/login',user.viewLoginform)

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login)

router.get('/logout',user.logout)

module.exports = router;
