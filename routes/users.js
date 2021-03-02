const express = require('express');
const catchAsync = require('../Utilities/catchAsync')
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User ({email,username});
    const registeredUser = await User.register(user,password);

    req.login(registeredUser,err =>{
        if(err) return next(err);
        console.log(registeredUser);
        req.flash('Welcome to Yelp camp');
        res.redirect('/campgrounds')
    });
    }
    catch(e)
    {
        req.flash('error',e.message)
        res.redirect('/register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','welcome back')
    const redirectedURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectedURL);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('sucess','GOODBYE');
    res.redirect('/campgrounds');
})

module.exports = router;
