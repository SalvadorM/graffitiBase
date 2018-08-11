const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');


var User = require('../models/user');

router.get('/', function(req, res){
  res.render('signup');
});

//handle post from signup/register
//and check for correct format
router.post('/register', [
    check('name','Please enter name').exists(),
    check('email','Invalid Email').isEmail(),
    check('email','Please enter email').exists(),
    check('username','Please enter username').exists(),
    check('password','Please enter password').exists(),
    check('password2','Passwords do not match')
      .exists()
      .custom((value, {req}) => value === req.body.password)
  ], function(req, res){
    //check for errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('signup',{
        errors: errors.array()
      });
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

      newUser.save(function(err){
        if(err){
          console.log(err);
          return;
        }else {
          console.log('Added new user');
          res.redirect('../');
        }
      });
    }
  });


module.exports = router;
