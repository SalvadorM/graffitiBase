const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator/check');

var User = require('../models/user');

router.get('/', function(req, res){
  res.redirect('..');
});
// signup route
router.get('/signup', function(req, res){
  res.render('signup');
});

//handle post from signup/register
//and check for correct format
router.post('/signup', [
    check('name','Please enter name').isLength({ min: 1 }),
    check('email','Invalid Email').isEmail(),
    check('email','Please enter email').exists(),
    check('username','Please enter username').isLength({ min: 1 }),
    check('password','Please enter password').isLength({ min: 1 }),
    check('password2','Passwords do not match')
      .isLength({ min: 1 })
      .custom((value, {req}) => value === req.body.password)
  ], function(req, res){
    //check for errors
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('signup',{ errors: errors.array() });
    }else {
      //pull data
      const name = req.body.name;
      const email = req.body.email;
      const username = req.body.username;
      const passw = req.body.password;
      const pass2 = req.body.password2;

      var newUser = new User({
        name:name,
        email:email,
        username:username,
        password:passw
      });

      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          //store with hash passw
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            }else {
              console.log('Added new user');
              res.redirect('../');
            }
          });
        });
      });

    }
  });

//login route
router.get('/login', function(req, res){
  res.render('login', {
    errors: req.flash('error')
  });
});
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/users/logged',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

 //logged route
 router.get('/logged',ensureAuthenticated, function(req, res){
   console.log(req.user);
   res.render('logged');
 });

 router.get('/logout', function(req, res){
   req.logout();
   res.redirect('/users/login');
 });

 // Access Control
 function ensureAuthenticated(req, res, next){
   if(req.isAuthenticated()){
     return next();
   } else {
     req.flash('danger', 'Please login');
     res.redirect('/users/login');
   }
 }


module.exports = router;
