const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email, password, done)=>{
            //check user email if exists

            User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null, false,{message:'This email is not registered'});
                    }//user doesn't exist

                    //check if password matches
                    bcrypt.compare(password,user.password,(err, isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null,false,{message:'Password incorrect'});
                        }
                    })
                })
                .catch(err=>console.log(err));
        })
    );


//serialize / deserialize user

passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user) =>{
      done(err, user);
    });
  });
}