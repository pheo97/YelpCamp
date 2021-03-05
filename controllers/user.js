const User = require('../models/user');

module.exports.viewRegisterform =  (req,res)=>{
    res.render('users/register');
};

module.exports.register = async(req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User ({email,username});
    const registeredUser = await User.register(user,password);

    req.login(registeredUser,err =>{
        if(err) return next(err);
        req.flash('Welcome to Yelp camp');
        res.redirect('/campgrounds')
    });
    }
    catch(e)
    {
        req.flash('error',e.message)
        res.redirect('/register');
    }
}

module.exports.viewLoginform = (req,res)=>{
    res.render('users/login');
}

module.exports.login = (req,res)=>{
    req.flash('success','welcome back')
    const redirectedURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectedURL);
};

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('sucess','GOODBYE');
    res.redirect('/campgrounds');
};