const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const router = express.Router();

router.get('/login',(req, res)=> res.render('login'));
router.get('/register',(req, res)=> res.render('register'));

//Register handle

router.post('/register', (req, res)=>{
    const {name, email,password, password2} = req.body;

    let errors= [];

    //check empty fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //check password match
    if(password !== password2){
        errors.push({msg:'Password do not match'});
    }
    //check password length at 6 characters
    if(password.length <6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    if(errors.length>0){
        //re render the page
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        
        //check if user email already exists

        User.findOne({email: email})
            .then(user=>{
                if(user){
                    //user exists already, re render the form
                    errors.push({msg:'Email is already registered'});
                    res.render("register",{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    //create a new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10,(err,salt)=>{
                      
                        bcrypt.hash(newUser.password, salt,(err,hash)=>{
                            if(err) throw err;

                            //set password to hashed
                            newUser.password = hash;

                            //save user
                            newUser.save()
                                .then(user=>{
                                    req.flash('success_msg','You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err=>console.log(err));
                        })
                        
                    })
                }
            });
    }
})

//login handle

router.post('/login', (req, res,next)=>{

    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);

});

router.get('/logout',(req, res)=> {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

router.get('/dashboard',(req, res)=> res.render('dashboard'));


module.exports = router;