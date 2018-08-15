const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/datab');

//export the local stragety
module.exports = function(passport) {
  passport.use(new LocalStrategy(function(username, password, done){
    User.findOne({username: username}, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }
      //compare hash Passwords
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else {
          return  done(null, false, {message: 'Wrong Password'});
        }
      });
    });
  }));
  //possport session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
