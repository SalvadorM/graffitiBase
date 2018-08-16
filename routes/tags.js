const express = require('express');
const router = express.Router();
const passport = require('passport');
const {body, validationResult} = require('express-validator/check');

const Tag = require('../models/tag');

router.get('/add',ensureAuthenticated, function(req, res){
  res.render('addtag',{
    errors: req.flash('error')
  });
});

//create new tag
router.post('/add',[
  body('tagname', 'Add name to tag image').isLength({min:1}),
  body('image').optional(),
  body('description').optional(),
  body('location').optional(),
], function(req, res){
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    res.render('addtag',{
      user: req.user,
      errors: errors.array()
    });
  }else{
    res.redirect('/users/logged');
  }

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
