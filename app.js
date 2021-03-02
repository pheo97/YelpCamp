//load up all plug ins to be used 
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const ExpressError = require('./utilities/ExpressError');


const session = require('express-session');
const flash = require('connect-flash');

const user = require('./models/user');


const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')



mongoose.connect('mongodb://localhost:27017/yelp-camp',
{   useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify:false,
     useCreateIndex: true })
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

const sessionConfig = {
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    Cookie:{
          httpOnly:true,
          expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
          maxAge:1000 * 60 * 60 * 24 * 7
    },

};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//middleware
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

//middleware for flash message
app.use((req,res,next)=>{
    console.log(req.session)
    /*if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }*/
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews/',reviewRoutes);
app.use('/',userRoutes);

//default route
app.get('/', (req,res) =>{
   res.render('home')
});



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