const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const {body, validationResult} = require('express-validator/check');

const Tag = require('../models/tag');

//Multer naming
const storage = multer.diskStorage({
  filename: function(req, res, cb){
    cb(null, res.fieldname+'-'+ Date.now())
  }
});
const upload = multer({
  storage: storage
});
//cloudinary
cloudinary.config({
  cloud_name: 'sronikle',
  api_key : '837478342353245',
  api_secret: 'dcAG3aQRKW-QCdKMZwHtx5tdgxM'
});

//request tags/add
router.get('/add',ensureAuthenticated, function(req, res){
  res.render('addtag',{
    errors: req.flash('error')
  });
});

//create new tag
router.post('/add', upload.single('image'),[
  body('tagname', 'Add name to tag image').isLength({min:1}),
  body('image').optional(),
  body('description', 'Add decrption to tag image').isLength({min:1}),
  body('location', 'Add location to tag image').isLength({min:1}),
], function(req, res){
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    res.render('addtag',{
      user: req.user,
      errors: errors.array()
    });
  }else{
    cloudinary.v2.uploader.upload(req.file.path,
      function(err, result){
        if(err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        console.log(result);
        //create new tag schema
        var newTag = new Tag({
          author: {
            id: req.user._id,
          username: req.user.username
          },
          tagname: req.body.tagname,
          image: result.secure_url,
          imageID: result.public_id,
          description: req.body.description,
          location: req.body.location
        });

        newTag.save(function(err){
          if(err){
            console.log(err);
            return;
          }else {
            console.log('Added new Tag');
            res.redirect('/tag/add')
          }
        });
    });
  }
});

//display all tags
router.get('/all', function(req,res){
  Tag.find({}, function(err, allTags){
    if(err){
      console.log(err)
    }else {
      console.log(allTags);
      res.render('display', {
        tags: allTags
      });
    }
  });
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
